package com.kodexia.model;

public class Carta {
    private final String nome;
    private final int performance;
    private final int sintaxe;
    private final int seguranca;
    private final int longevidade;
    private final int popularidade;

    public Carta(String nome, int performance, int sintaxe, int seguranca, int longevidade, int popularidade) {
        this.nome = nome;
        this.performance = performance;
        this.sintaxe = sintaxe;
        this.seguranca = seguranca;
        this.longevidade = longevidade;
        this.popularidade = popularidade;
    }

    public String getNome() { return nome; }
    public int getPerformance() { return performance; }
    public int getSintaxe() { return sintaxe; }
    public int getSeguranca() { return seguranca; }
    public int getLongevidade() { return longevidade; }
    public int getPopularidade() { return popularidade; }

    public int getValorAtributo(String atributo) {
        switch (atributo.toLowerCase()) {
            case "performance": return performance;
            case "sintaxe": return sintaxe;
            case "segurança": return seguranca;
            case "longevidade": return longevidade;
            case "popularidade": return popularidade;
            default: return 0;
        }
    }
}
