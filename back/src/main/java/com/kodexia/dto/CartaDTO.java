package com.kodexia.dto;

import com.kodexia.model.GrupoCarta;

public class CartaDTO {
    private String id;
    private GrupoCarta grupo;
    private String codigo;
    private String nome;
    private String imagem;
    private double performance;
    private double sintaxe;
    private double seguranca;
    private double longevidade;
    private double popularidade;
    private double abstracao;
    private double versatilidade;
    private boolean lendaria;

    public CartaDTO() {
        // Required for Jackson deserialization
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public GrupoCarta getGrupo() { return grupo; }
    public void setGrupo(GrupoCarta grupo) { this.grupo = grupo; }

    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getImagem() { return imagem; }
    public void setImagem(String imagem) { this.imagem = imagem; }

    public double getPerformance() { return performance; }
    public void setPerformance(double performance) { this.performance = performance; }

    public double getSintaxe() { return sintaxe; }
    public void setSintaxe(double sintaxe) { this.sintaxe = sintaxe; }

    public double getSeguranca() { return seguranca; }
    public void setSeguranca(double seguranca) { this.seguranca = seguranca; }

    public double getLongevidade() { return longevidade; }
    public void setLongevidade(double longevidade) { this.longevidade = longevidade; }

    public double getPopularidade() { return popularidade; }
    public void setPopularidade(double popularidade) { this.popularidade = popularidade; }

    public double getAbstracao() { return abstracao; }
    public void setAbstracao(double abstracao) { this.abstracao = abstracao; }

    public double getVersatilidade() { return versatilidade; }
    public void setVersatilidade(double versatilidade) { this.versatilidade = versatilidade; }

    public boolean isLendaria() { return lendaria; }
    public void setLendaria(boolean lendaria) { this.lendaria = lendaria; }
}
