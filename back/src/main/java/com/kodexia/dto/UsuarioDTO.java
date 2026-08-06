package com.kodexia.dto;

public class UsuarioDTO {
    private String id;
    private String login;
    private String nome;

    public UsuarioDTO() {
        // Required for Jackson deserialization
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getLogin() { return login; }
    public void setLogin(String login) { this.login = login; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
}
