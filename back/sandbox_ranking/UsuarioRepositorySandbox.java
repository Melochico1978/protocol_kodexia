package com.kodexia.sandbox;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UsuarioRepositorySandbox extends JpaRepository<UsuarioEntitySandbox, String> {
    List<UsuarioEntitySandbox> findByLogin(String login);
}
