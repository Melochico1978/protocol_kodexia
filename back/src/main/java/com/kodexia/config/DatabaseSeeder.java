package com.kodexia.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kodexia.model.CartaEntity;
import com.kodexia.model.GrupoCarta;
import com.kodexia.model.UsuarioEntity;
import com.kodexia.repository.CartaRepository;
import com.kodexia.repository.UsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseSeeder.class);

    private final CartaRepository cartaRepository;
    private final UsuarioRepository usuarioRepository;
    private final String dbJsonPath;
    private final String dbJsonFallbackPath;

    public DatabaseSeeder(
            CartaRepository cartaRepository,
            UsuarioRepository usuarioRepository,
            @Value("${app.db.json.path:../front/db.json}") String dbJsonPath,
            @Value("${app.db.json.fallback-path:c:/Users/CHICO/Desktop/tcc kodexia/front/db.json}") String dbJsonFallbackPath) {
        this.cartaRepository = cartaRepository;
        this.usuarioRepository = usuarioRepository;
        this.dbJsonPath = dbJsonPath;
        this.dbJsonFallbackPath = dbJsonFallbackPath;
    }

    @Override
    public void run(String... args) throws Exception {
        if (cartaRepository.count() > 0) {
            return; // Já semeado
        }

        String path = this.dbJsonPath;
        if (!Files.exists(Paths.get(path))) {
            path = this.dbJsonFallbackPath;
        }

        if (Files.exists(Paths.get(path))) {
            logger.info("Semeando banco de dados a partir de: {}", path);
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(new File(path));

            seedCartas(rootNode);
            seedUsuarios(rootNode);

            logger.info("Banco de dados semeado com sucesso!");
        } else {
            logger.warn("Aviso: arquivo db.json nao encontrado para semear o banco de dados.");
        }
    }

    private void seedCartas(JsonNode rootNode) {
        JsonNode cartasNode = rootNode.get("cartas");
        if (cartasNode != null && cartasNode.isArray()) {
            for (JsonNode node : cartasNode) {
                CartaEntity carta = new CartaEntity();
                carta.setId(node.get("id").asText());
                carta.setGrupo(GrupoCarta.valueOf(node.get("grupo").asText().toUpperCase()));
                carta.setCodigo(node.get("codigo").asText());
                carta.setNome(node.get("nome").asText());
                carta.setImagem(node.get("imagem").asText());
                carta.setPerformance(node.get("performance").asDouble());
                carta.setSintaxe(node.get("sintaxe").asDouble());
                carta.setSeguranca(node.get("seguranca").asDouble());
                carta.setLongevidade(node.get("longevidade").asDouble());
                carta.setPopularidade(node.get("popularidade").asDouble());
                carta.setAbstracao(node.get("abstracao").asDouble());
                carta.setVersatilidade(node.get("versatilidade").asDouble());
                carta.setLendaria(node.has("lendaria") && node.get("lendaria").asBoolean());
                cartaRepository.save(carta);
            }
        }
    }

    private void seedUsuarios(JsonNode rootNode) {
        JsonNode usuariosNode = rootNode.get("usuarios");
        if (usuariosNode != null && usuariosNode.isArray()) {
            for (JsonNode node : usuariosNode) {
                UsuarioEntity usuario = new UsuarioEntity();
                usuario.setId(node.get("id").asText());
                usuario.setLogin(node.get("login").asText());
                usuario.setNome(node.get("nome").asText());
                usuarioRepository.save(usuario);
            }
        }
    }
}
