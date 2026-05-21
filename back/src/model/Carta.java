package model;

public class Carta {
    private GrupoCarta grupo;
    private String codigo;
    private String nome;   
    
    private double performance;
    private double sintaxe;
    private double seguranca;
    private double longevidade;
    private double popularidade;
    private double abstracao;
    private double versatilidade;

    public Carta(GrupoCarta grupo, String codigo, String nome, double performance, double sintaxe, double seguranca, double longevidade, double popularidade, double abstracao, double versatilidade) {
        if (nome == null || nome.trim().isEmpty()) {
            throw new IllegalArgumentException("Erro: O NOME da linguagem deve ser informado.");
        }
        if (codigo == null || codigo.trim().isEmpty()) {
            throw new IllegalArgumentException("Erro: O CÓDIGO da carta deve ser informado.");
        }

        this.grupo = grupo;
        this.codigo = codigo;
        this.nome = nome;
        
        this.performance = validarNota(performance, "Performance");
        this.sintaxe = validarNota(sintaxe, "Sintaxe");
        this.seguranca = validarNota(seguranca, "Segurança");
        this.longevidade = validarNota(longevidade, "Longevidade");
        this.popularidade = validarNota(popularidade, "Popularidade");
        this.abstracao = validarNota(abstracao, "Abstração");
        this.versatilidade = validarNota(versatilidade, "Versatilidade");
    }

    private double validarNota(double valor, String nomeDoAtributo) {
        if (valor < 0.0 || valor > 100.0) {
            throw new IllegalArgumentException("Erro: A nota de " + nomeDoAtributo + " deve estar entre 0 e 100. Valor recebido: " + valor);
        }
        return valor;
    }

    public GrupoCarta getGrupo() { return this.grupo; }
    public String getCodigo() { return this.codigo; }
    public String getNome() { return this.nome; }
    
    public double getPerformance() { return this.performance; }
    public double getSintaxe() { return this.sintaxe; }
    public double getSeguranca() { return this.seguranca; }
    public double getLongevidade() { return this.longevidade; }
    public double getPopularidade() { return this.popularidade; }
    public double getAbstracao() { return this.abstracao; }
    public double getVersatilidade() { return this.versatilidade; }

    public void exibirCarta() {
        System.out.println("--- CARTA ---");
        System.out.println("Código.......: " + this.grupo.name() + "-" + this.codigo);
        System.out.println("Linguagem....: " + this.nome);
        System.out.println("Performance..: " + getPerformance());
        System.out.println("Sintaxe......: " + getSintaxe());
        System.out.println("Segurança....: " + getSeguranca());
        System.out.println("Longevidade..: " + getLongevidade());
        System.out.println("Popularidade.: " + getPopularidade());
        System.out.println("Abstração....: " + getAbstracao());
        System.out.println("Versatilidade: " + getVersatilidade());
    }
}