package com.kodexia.controller;

import com.kodexia.dto.CartaDTO;
import com.kodexia.dto.UsuarioDTO;
import com.kodexia.model.CartaEntity;
import com.kodexia.model.UsuarioEntity;
import com.kodexia.repository.CartaRepository;
import com.kodexia.repository.UsuarioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "${app.cors.allowed-origins:http://localhost:4200}", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class CartaController {

    private final CartaRepository cartaRepository;
    private final UsuarioRepository usuarioRepository;

    public CartaController(CartaRepository cartaRepository, UsuarioRepository usuarioRepository) {
        this.cartaRepository = cartaRepository;
        this.usuarioRepository = usuarioRepository;
    }

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
    public CartaEntity criarCarta(@RequestBody CartaDTO cartaDto) {
        CartaEntity carta = new CartaEntity();
        if (cartaDto.getId() != null && !cartaDto.getId().trim().isEmpty()) {
            carta.setId(cartaDto.getId());
        } else {
            carta.setId(UUID.randomUUID().toString());
        }
        updateEntityFromDto(carta, cartaDto);
        return cartaRepository.save(carta);
    }

    @PutMapping("/cartas/{id}")
    public ResponseEntity<CartaEntity> atualizarCarta(@PathVariable String id, @RequestBody CartaDTO cartaAtualizada) {
        return cartaRepository.findById(id)
                .map(carta -> {
                    updateEntityFromDto(carta, cartaAtualizada);
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
    public UsuarioEntity criarUsuario(@RequestBody UsuarioDTO usuarioDto) {
        UsuarioEntity usuario = new UsuarioEntity();
        if (usuarioDto.getId() != null && !usuarioDto.getId().trim().isEmpty()) {
            usuario.setId(usuarioDto.getId());
        } else {
            usuario.setId(UUID.randomUUID().toString());
        }
        usuario.setLogin(usuarioDto.getLogin());
        usuario.setNome(usuarioDto.getNome());
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

    private void updateEntityFromDto(CartaEntity entity, CartaDTO dto) {
        entity.setGrupo(dto.getGrupo());
        entity.setCodigo(dto.getCodigo());
        entity.setNome(dto.getNome());
        entity.setImagem(dto.getImagem());
        entity.setPerformance(dto.getPerformance());
        entity.setSintaxe(dto.getSintaxe());
        entity.setSeguranca(dto.getSeguranca());
        entity.setLongevidade(dto.getLongevidade());
        entity.setPopularidade(dto.getPopularidade());
        entity.setAbstracao(dto.getAbstracao());
        entity.setVersatilidade(dto.getVersatilidade());
        entity.setLendaria(dto.isLendaria());
    }
}
