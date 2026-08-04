package com.kodexia.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kodexia.model.CartaEntity;
import com.kodexia.model.GrupoCarta;
import com.kodexia.model.UsuarioEntity;
import com.kodexia.repository.CartaRepository;
import com.kodexia.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private CartaRepository cartaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public void run(String... args) throws Exception {
        if (cartaRepository.count() > 0) {
            return; // Já semeado
        }

        String dbJsonPath = "../front/db.json";
        if (!Files.exists(Paths.get(dbJsonPath))) {
            dbJsonPath = "c:/Users/CHICO/Desktop/tcc kodexia/front/db.json";
        }

        if (Files.exists(Paths.get(dbJsonPath))) {
            System.out.println("Semeando banco de dados a partir de: " + dbJsonPath);
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(new File(dbJsonPath));

            // Semeia cartas
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

            // Semeia usuarios
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
            System.out.println("Banco de dados semeado com sucesso!");
        } else {
            System.err.println("Aviso: arquivo db.json nao encontrado para semear o banco de dados.");
        }
    }
}
