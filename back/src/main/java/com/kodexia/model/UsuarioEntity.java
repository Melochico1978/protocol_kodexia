package com.kodexia.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "usuarios")
public class UsuarioEntity {

    @Id
    private String id;
    private String login;
    private String nome;

    public UsuarioEntity() {}

    public UsuarioEntity(String id, String login, String nome) {
        this.id = id;
        this.login = login;
        this.nome = nome;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getLogin() { return login; }
    public void setLogin(String login) { this.login = login; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
}
