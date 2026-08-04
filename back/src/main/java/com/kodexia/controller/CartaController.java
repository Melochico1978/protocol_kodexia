package com.kodexia.controller;

import com.kodexia.model.CartaEntity;
import com.kodexia.model.UsuarioEntity;
import com.kodexia.repository.CartaRepository;
import com.kodexia.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class CartaController {

    @Autowired
    private CartaRepository cartaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // --- CARTAS ENDPOINTS ---

    @GetMapping("/cartas")
    public List<CartaEntity> listarCartas() {
        return cartaRepository.findAll();
    }

    @GetMapping("/cartas/{id}")
    public ResponseEntity<CartaEntity> obterCarta(@PathVariable String id) {
        return cartaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/cartas")
    public CartaEntity criarCarta(@RequestBody CartaEntity carta) {
        if (carta.getId() == null || carta.getId().trim().isEmpty()) {
            carta.setId(UUID.randomUUID().toString());
        }
        return cartaRepository.save(carta);
    }

    @PutMapping("/cartas/{id}")
    public ResponseEntity<CartaEntity> atualizarCarta(@PathVariable String id, @RequestBody CartaEntity cartaAtualizada) {
        return cartaRepository.findById(id)
                .map(carta -> {
                    carta.setGrupo(cartaAtualizada.getGrupo());
                    carta.setCodigo(cartaAtualizada.getCodigo());
                    carta.setNome(cartaAtualizada.getNome());
                    carta.setImagem(cartaAtualizada.getImagem());
                    carta.setPerformance(cartaAtualizada.getPerformance());
                    carta.setSintaxe(cartaAtualizada.getSintaxe());
                    carta.setSeguranca(cartaAtualizada.getSeguranca());
                    carta.setLongevidade(cartaAtualizada.getLongevidade());
                    carta.setPopularidade(cartaAtualizada.getPopularidade());
                    carta.setAbstracao(cartaAtualizada.getAbstracao());
                    carta.setVersatilidade(cartaAtualizada.getVersatilidade());
                    carta.setLendaria(cartaAtualizada.isLendaria());
                    return ResponseEntity.ok(cartaRepository.save(carta));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/cartas/{id}")
    public ResponseEntity<Void> deletarCarta(@PathVariable String id) {
        if (cartaRepository.existsById(id)) {
            cartaRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    // --- USUARIOS ENDPOINTS ---

    @GetMapping("/usuarios")
    public List<UsuarioEntity> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    @PostMapping("/usuarios")
    public UsuarioEntity criarUsuario(@RequestBody UsuarioEntity usuario) {
        if (usuario.getId() == null || usuario.getId().trim().isEmpty()) {
            usuario.setId(UUID.randomUUID().toString());
        }
        return usuarioRepository.save(usuario);
    }

    @DeleteMapping("/usuarios/{id}")
    public ResponseEntity<Void> deletarUsuario(@PathVariable String id) {
        if (usuarioRepository.existsById(id)) {
            usuarioRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
