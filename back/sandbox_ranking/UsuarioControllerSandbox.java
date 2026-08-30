package com.kodexia.sandbox;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Sort;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/sandbox/usuarios")
@CrossOrigin(origins = "*") // Evita erro de CORS com o frontend
public class UsuarioControllerSandbox {

    @Autowired
    private UsuarioRepositorySandbox repository;

    // Rota de Login e Busca Geral
    @GetMapping
    public List<UsuarioEntitySandbox> getUsuarios(@RequestParam(required = false) String login) {
        if (login != null && !login.trim().isEmpty()) {
            return repository.findByLogin(login);
        }
        return repository.findAll();
    }

    // Rota do PLACAR (Ranking) - Puxa os Top 10 que mais têm vitórias
    @GetMapping("/ranking")
    public List<UsuarioEntitySandbox> getRanking() {
        return repository.findAll(Sort.by(Sort.Direction.DESC, "vitoriasJogador"));
    }

    // Rota de Cadastro
    @PostMapping
    public UsuarioEntitySandbox createUsuario(@RequestBody UsuarioEntitySandbox usuario) {
        if (usuario.getId() == null || usuario.getId().isEmpty()) {
            usuario.setId(UUID.randomUUID().toString());
        }
        return repository.save(usuario);
    }

    // Rota de Salvamento de Progresso
    @PutMapping("/{id}")
    public UsuarioEntitySandbox updateUsuario(@PathVariable String id, @RequestBody UsuarioEntitySandbox usuario) {
        usuario.setId(id);
        return repository.save(usuario);
    }
}
