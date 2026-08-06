package com.kodexia;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * =====================================================================
 * KODEXIA - SUPER TRUNFO CUSTOM DUEL (SWING + MVC)
 * =====================================================================
 * Esta é uma implementação completa de duelo de cartas baseado em turnos.
 * Arquitetura: Model-View-Controller (MVC)
 * Tema visual: Cyberpunk Dark Mode
 * =====================================================================
 */
public class SuperTrunfoGame {

    public static void main(String[] args) {
        // Inicializa a aplicação Swing na Thread correta de Eventos
        SwingUtilities.invokeLater(() -> {
            // Criação do Modelo
            JogoModel model = new JogoModel();
            
            // Criação da View
            JogoView view = new JogoView();
            
            // Criação do Controller (Liga Model e View)
            new JogoController(model, view);
            
            // Exibe a janela principal
            view.setVisible(true);
        });
    }

    // ==========================================
    // 1. MODEL
    // ==========================================
    
    public static class Carta {
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

    public static class JogoModel {
        private List<Carta> baralho;
        private Carta cartaAtualP1;
        private Carta cartaAtualP2;

        private int pontuacaoP1 = 0;
        private int pontuacaoP2 = 0;
        private int rodadaAtual = 1;

        // Controle de turnos e escolhas
        // Turno 1 = Jogador 1 escolhendo. Turno 2 = Jogador 2 escolhendo. Turno 3 = Fim do Duelo (Comparação)
        private int turnoAtual = 1; 

        private String atributoP1 = "";
        private int valorP1 = 0;

        private String atributoP2 = "";
        private int valorP2 = 0;

        private String logDuelo = "Inicie a rodada escolhendo um atributo.";

        public JogoModel() {
            inicializarBaralho();
            distribuirCartas();
        }

        private void inicializarBaralho() {
            baralho = new ArrayList<>();
            baralho.add(new Carta("V8 Engine", 95, 80, 70, 60, 90));
            baralho.add(new Carta("WebAssembly", 90, 85, 80, 70, 75));
            baralho.add(new Carta("JVM Compiler", 85, 75, 90, 85, 80));
            baralho.add(new Carta("Python VM", 60, 95, 65, 90, 95));
            baralho.add(new Carta("Rust Analyzer", 88, 70, 98, 75, 85));
            baralho.add(new Carta("C++ Core", 98, 55, 60, 95, 70));
            Collections.shuffle(baralho);
        }

        public void distribuirCartas() {
            if (baralho.size() < 2) {
                inicializarBaralho();
            }
            cartaAtualP1 = baralho.remove(0);
            cartaAtualP2 = baralho.remove(0);
            
            // Reseta escolhas da rodada
            atributoP1 = "";
            valorP1 = 0;
            atributoP2 = "";
            valorP2 = 0;
            turnoAtual = 1;
        }

        public Carta getCartaAtualP1() { return cartaAtualP1; }
        public Carta getCartaAtualP2() { return cartaAtualP2; }

        public int getTurnoAtual() { return turnoAtual; }
        public void setTurnoAtual(int turno) { this.turnoAtual = turno; }

        public int getPontuacaoP1() { return pontuacaoP1; }
        public int getPontuacaoP2() { return pontuacaoP2; }
        public int getRodadaAtual() { return rodadaAtual; }

        public void registrarEscolhaP1(String atributo, int valor) {
            this.atributoP1 = atributo;
            this.valorP1 = valor;
            this.turnoAtual = 2; // Passa o turno para P2
            this.logDuelo = "Jogador 1 escolheu " + atributo + ". Agora é a vez do Jogador 2!";
        }

        public void registrarEscolhaP2(String atributo, int valor) {
            this.atributoP2 = atributo;
            this.valorP2 = valor;
            this.turnoAtual = 3; // Ambos escolheram, pronto para comparar
            this.logDuelo = "Ambos escolheram! Clique em 'Resolver Duelo' para ver o resultado.";
        }

        public void processarDuelo() {
            String resultado = "";
            if (valorP1 > valorP2) {
                pontuacaoP1++;
                resultado = "VENCEDOR DA RODADA: Jogador 1!";
            } else if (valorP2 > valorP1) {
                pontuacaoP2++;
                resultado = "VENCEDOR DA RODADA: Jogador 2!";
            } else {
                resultado = "RODADA EMPATADA!";
            }

            logDuelo = String.format(
                "★ DUELO: Jogador 1 (%s: %d) VS Jogador 2 (%s: %d)\n> %s",
                atributoP1, valorP1, atributoP2, valorP2, resultado
            );

            rodadaAtual++;
        }

        public String getLogDuelo() { return logDuelo; }
        public String getAtributoP1() { return atributoP1; }
        public String getAtributoP2() { return atributoP2; }
    }

    // ==========================================
    // 2. VIEW
    // ==========================================
    
    public static class JogoView extends JFrame {
        // Painéis dos jogadores
        private JPanel painelP1;
        private JPanel painelP2;

        // Exibição dos nomes das cartas
        private JLabel lblNomeCartaP1;
        private JLabel lblNomeCartaP2;

        // Botões de atributos do Jogador 1
        private JButton btnP1Performance;
        private JButton btnP1Sintaxe;
        private JButton btnP1Seguranca;
        private JButton btnP1Longevidade;
        private JButton btnP1Popularidade;

        // Botões de atributos do Jogador 2
        private JButton btnP2Performance;
        private JButton btnP2Sintaxe;
        private JButton btnP2Seguranca;
        private JButton btnP2Longevidade;
        private JButton btnP2Popularidade;

        // Status geral e logs
        private JLabel lblTurnoIndicator;
        private JLabel lblPlacar;
        private JTextArea txtLog;
        private JButton btnProximaRodada;

        public JogoView() {
            setTitle("Kodexia - Duelo Super Trunfo");
            setSize(900, 600);
            setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
            setLocationRelativeTo(null);
            setLayout(new BorderLayout());

            // Cores Customizadas (Cyberpunk Dark Mode)
            Color bgColor = new Color(13, 16, 23);
            Color cardColor = new Color(22, 28, 41);
            Color textLight = new Color(240, 246, 252);
            Color accentColor = new Color(255, 65, 108);

            getContentPane().setBackground(bgColor);

            // 1. Painel de Cabeçalho (Turnos e Placar)
            JPanel painelTopo = new JPanel(new GridLayout(2, 1));
            painelTopo.setBackground(bgColor);

            lblTurnoIndicator = new JLabel("TURNO: Jogador 1", SwingConstants.CENTER);
            lblTurnoIndicator.setFont(new Font("Monospaced", Font.BOLD, 22));
            lblTurnoIndicator.setForeground(accentColor);

            lblPlacar = new JLabel("Rodada: 1 | Jogador 1: 0 - 0 :Jogador 2", SwingConstants.CENTER);
            lblPlacar.setFont(new Font("Monospaced", Font.PLAIN, 16));
            lblPlacar.setForeground(textLight);

            painelTopo.add(lblTurnoIndicator);
            painelTopo.add(lblPlacar);
            add(painelTopo, BorderLayout.NORTH);

            // 2. Painel Central (Cartas)
            JPanel painelCentral = new JPanel(new GridLayout(1, 2, 20, 0));
            painelCentral.setBackground(bgColor);
            painelCentral.setBorder(BorderFactory.createEmptyBorder(20, 20, 20, 20));

            // Carta 1
            painelP1 = new JPanel();
            painelP1.setBackground(cardColor);
            painelP1.setBorder(BorderFactory.createLineBorder(accentColor, 2));
            painelP1.setLayout(new BoxLayout(painelP1, BoxLayout.Y_AXIS));

            lblNomeCartaP1 = new JLabel("CARTA 1", SwingConstants.CENTER);
            lblNomeCartaP1.setFont(new Font("Monospaced", Font.BOLD, 18));
            lblNomeCartaP1.setForeground(textLight);
            lblNomeCartaP1.setAlignmentX(Component.CENTER_ALIGNMENT);
            painelP1.add(Box.createVerticalStrut(10));
            painelP1.add(lblNomeCartaP1);
            painelP1.add(Box.createVerticalStrut(20));

            btnP1Performance = criarBotaoAtributo("Performance", cardColor, textLight);
            btnP1Sintaxe = criarBotaoAtributo("Sintaxe", cardColor, textLight);
            btnP1Seguranca = criarBotaoAtributo("Segurança", cardColor, textLight);
            btnP1Longevidade = criarBotaoAtributo("Longevidade", cardColor, textLight);
            btnP1Popularidade = criarBotaoAtributo("Popularidade", cardColor, textLight);

            painelP1.add(btnP1Performance);
            painelP1.add(btnP1Sintaxe);
            painelP1.add(btnP1Seguranca);
            painelP1.add(btnP1Longevidade);
            painelP1.add(btnP1Popularidade);

            // Carta 2
            painelP2 = new JPanel();
            painelP2.setBackground(cardColor);
            painelP2.setBorder(BorderFactory.createLineBorder(Color.GRAY, 2));
            painelP2.setLayout(new BoxLayout(painelP2, BoxLayout.Y_AXIS));

            lblNomeCartaP2 = new JLabel("CARTA 2 (Oculta)", SwingConstants.CENTER);
            lblNomeCartaP2.setFont(new Font("Monospaced", Font.BOLD, 18));
            lblNomeCartaP2.setForeground(textLight);
            lblNomeCartaP2.setAlignmentX(Component.CENTER_ALIGNMENT);
            painelP2.add(Box.createVerticalStrut(10));
            painelP2.add(lblNomeCartaP2);
            painelP2.add(Box.createVerticalStrut(20));

            btnP2Performance = criarBotaoAtributo("Performance", cardColor, textLight);
            btnP2Sintaxe = criarBotaoAtributo("Sintaxe", cardColor, textLight);
            btnP2Seguranca = criarBotaoAtributo("Segurança", cardColor, textLight);
            btnP2Longevidade = criarBotaoAtributo("Longevidade", cardColor, textLight);
            btnP2Popularidade = criarBotaoAtributo("Popularidade", cardColor, textLight);

            painelP2.add(btnP2Performance);
            painelP2.add(btnP2Sintaxe);
            painelP2.add(btnP2Seguranca);
            painelP2.add(btnP2Longevidade);
            painelP2.add(btnP2Popularidade);

            painelCentral.add(painelP1);
            painelCentral.add(painelP2);
            add(painelCentral, BorderLayout.CENTER);

            // 3. Painel de Logs e Controles (Fundo)
            JPanel painelInferior = new JPanel(new BorderLayout());
            painelInferior.setBackground(bgColor);
            painelInferior.setBorder(BorderFactory.createEmptyBorder(10, 20, 20, 20));

            txtLog = new JTextArea(4, 50);
            txtLog.setBackground(cardColor);
            txtLog.setForeground(new Color(57, 255, 20)); // Verde Matrix
            txtLog.setFont(new Font("Monospaced", Font.PLAIN, 14));
            txtLog.setEditable(false);
            txtLog.setBorder(BorderFactory.createTitledBorder(
                BorderFactory.createLineBorder(new Color(57, 255, 20)),
                "LOG DE DUELO.bat", 0, 0, null, new Color(57, 255, 20)
            ));

            btnProximaRodada = new JButton("Resolver Duelo");
            btnProximaRodada.setBackground(accentColor);
            btnProximaRodada.setForeground(textLight);
            btnProximaRodada.setFont(new Font("Monospaced", Font.BOLD, 16));
            btnProximaRodada.setFocusPainted(false);
            btnProximaRodada.setEnabled(false); // Só ativa quando P1 e P2 escolherem

            painelInferior.add(new JScrollPane(txtLog), BorderLayout.CENTER);
            painelInferior.add(btnProximaRodada, BorderLayout.SOUTH);
            add(painelInferior, BorderLayout.SOUTH);
        }

        private JButton criarBotaoAtributo(String texto, Color bg, Color fg) {
            JButton btn = new JButton(texto);
            btn.setMaximumSize(new Dimension(350, 40));
            btn.setAlignmentX(Component.CENTER_ALIGNMENT);
            btn.setBackground(bg);
            btn.setForeground(fg);
            btn.setFont(new Font("Monospaced", Font.PLAIN, 14));
            btn.setFocusPainted(false);
            btn.setBorder(BorderFactory.createEmptyBorder(5, 5, 5, 5));
            return btn;
        }

        // Getters para os componentes da View
        public JButton getBtnP1Performance() { return btnP1Performance; }
        public JButton getBtnP1Sintaxe() { return btnP1Sintaxe; }
        public JButton getBtnP1Seguranca() { return btnP1Seguranca; }
        public JButton getBtnP1Longevidade() { return btnP1Longevidade; }
        public JButton getBtnP1Popularidade() { return btnP1Popularidade; }

        public JButton getBtnP2Performance() { return btnP2Performance; }
        public JButton getBtnP2Sintaxe() { return btnP2Sintaxe; }
        public JButton getBtnP2Seguranca() { return btnP2Seguranca; }
        public JButton getBtnP2Longevidade() { return btnP2Longevidade; }
        public JButton getBtnP2Popularidade() { return btnP2Popularidade; }

        public JButton getBtnProximaRodada() { return btnProximaRodada; }
        public JTextArea getTxtLog() { return txtLog; }

        // Métodos de atualização de estado visual
        public void atualizarView(JogoModel model) {
            lblPlacar.setText(String.format("Rodada: %d | Placar: Jogador 1: %d - %d :Jogador 2", 
                model.getRodadaAtual(), model.getPontuacaoP1(), model.getPontuacaoP2()));
            txtLog.setText(model.getLogDuelo());

            int turno = model.getTurnoAtual();

            if (turno == 1) {
                // Turno Jogador 1: ativa P1, esconde P2
                lblTurnoIndicator.setText("TURNO: Jogador 1 (Selecione Atributo)");
                lblTurnoIndicator.setForeground(new Color(255, 65, 108));
                
                lblNomeCartaP1.setText(model.getCartaAtualP1().getNome());
                lblNomeCartaP2.setText("CARTA DO OPONENTE (Oculta)");

                // Atualiza textos dos valores na tela para P1
                btnP1Performance.setText("Performance: " + model.getCartaAtualP1().getPerformance());
                btnP1Sintaxe.setText("Sintaxe: " + model.getCartaAtualP1().getSintaxe());
                btnP1Seguranca.setText("Segurança: " + model.getCartaAtualP1().getSeguranca());
                btnP1Longevidade.setText("Longevidade: " + model.getCartaAtualP1().getLongevidade());
                btnP1Popularidade.setText("Popularidade: " + model.getCartaAtualP1().getPopularidade());

                // Reseta textos do P2 para ocultar valores
                btnP2Performance.setText("Performance: [OCULTO]");
                btnP2Sintaxe.setText("Sintaxe: [OCULTO]");
                btnP2Seguranca.setText("Segurança: [OCULTO]");
                btnP2Longevidade.setText("Longevidade: [OCULTO]");
                btnP2Popularidade.setText("Popularidade: [OCULTO]");

                // Habilita/Desabilita painéis
                configurarAtivacaoBotoesP1(true);
                configurarAtivacaoBotoesP2(false);

                painelP1.setBorder(BorderFactory.createLineBorder(new Color(255, 65, 108), 2));
                painelP2.setBorder(BorderFactory.createLineBorder(Color.GRAY, 2));

                btnProximaRodada.setText("Aguardando escolhas...");
                btnProximaRodada.setEnabled(false);

            } else if (turno == 2) {
                // Turno Jogador 2: ativa P2, esconde P1
                lblTurnoIndicator.setText("TURNO: Jogador 2 (Selecione Atributo)");
                lblTurnoIndicator.setForeground(new Color(51, 153, 255));

                lblNomeCartaP1.setText("CARTA DO OPONENTE (Oculta)");
                lblNomeCartaP2.setText(model.getCartaAtualP2().getNome());

                // Reseta textos do P1 para ocultar valores
                btnP1Performance.setText("Performance: [OCULTO]");
                btnP1Sintaxe.setText("Sintaxe: [OCULTO]");
                btnP1Seguranca.setText("Segurança: [OCULTO]");
                btnP1Longevidade.setText("Longevidade: [OCULTO]");
                btnP1Popularidade.setText("Popularidade: [OCULTO]");

                // Exibe os valores reais do P2 na tela dele
                btnP2Performance.setText("Performance: " + model.getCartaAtualP2().getPerformance());
                btnP2Sintaxe.setText("Sintaxe: " + model.getCartaAtualP2().getSintaxe());
                btnP2Seguranca.setText("Segurança: " + model.getCartaAtualP2().getSeguranca());
                btnP2Longevidade.setText("Longevidade: " + model.getCartaAtualP2().getLongevidade());
                btnP2Popularidade.setText("Popularidade: " + model.getCartaAtualP2().getPopularidade());

                // Habilita/Desabilita painéis
                configurarAtivacaoBotoesP1(false);
                configurarAtivacaoBotoesP2(true);

                painelP1.setBorder(BorderFactory.createLineBorder(Color.GRAY, 2));
                painelP2.setBorder(BorderFactory.createLineBorder(new Color(51, 153, 255), 2));

                btnProximaRodada.setText("Aguardando escolhas...");
                btnProximaRodada.setEnabled(false);

            } else if (turno == 3) {
                // Fim do duelo (Ambos escolheram, pronto para revelar)
                lblTurnoIndicator.setText("DUELO PRONTO!");
                lblTurnoIndicator.setForeground(Color.YELLOW);

                // Mostra as duas cartas
                lblNomeCartaP1.setText(model.getCartaAtualP1().getNome());
                lblNomeCartaP2.setText(model.getCartaAtualP2().getNome());

                // Mostra os valores escolhidos com destaque
                btnP1Performance.setText("Performance: " + model.getCartaAtualP1().getPerformance());
                btnP1Sintaxe.setText("Sintaxe: " + model.getCartaAtualP1().getSintaxe());
                btnP1Seguranca.setText("Segurança: " + model.getCartaAtualP1().getSeguranca());
                btnP1Longevidade.setText("Longevidade: " + model.getCartaAtualP1().getLongevidade());
                btnP1Popularidade.setText("Popularidade: " + model.getCartaAtualP1().getPopularidade());

                btnP2Performance.setText("Performance: " + model.getCartaAtualP2().getPerformance());
                btnP2Sintaxe.setText("Sintaxe: " + model.getCartaAtualP2().getSintaxe());
                btnP2Seguranca.setText("Segurança: " + model.getCartaAtualP2().getSeguranca());
                btnP2Longevidade.setText("Longevidade: " + model.getCartaAtualP2().getLongevidade());
                btnP2Popularidade.setText("Popularidade: " + model.getCartaAtualP2().getPopularidade());

                // Desativa todos os botões de atributo
                configurarAtivacaoBotoesP1(false);
                configurarAtivacaoBotoesP2(false);

                painelP1.setBorder(BorderFactory.createLineBorder(Color.YELLOW, 2));
                painelP2.setBorder(BorderFactory.createLineBorder(Color.YELLOW, 2));

                btnProximaRodada.setText("Resolver Duelo!");
                btnProximaRodada.setEnabled(true);
            }
        }

        private void configurarAtivacaoBotoesP1(boolean ativo) {
            btnP1Performance.setEnabled(ativo);
            btnP1Sintaxe.setEnabled(ativo);
            btnP1Seguranca.setEnabled(ativo);
            btnP1Longevidade.setEnabled(ativo);
            btnP1Popularidade.setEnabled(ativo);
        }

        private void configurarAtivacaoBotoesP2(boolean ativo) {
            btnP2Performance.setEnabled(ativo);
            btnP2Sintaxe.setEnabled(ativo);
            btnP2Seguranca.setEnabled(ativo);
            btnP2Longevidade.setEnabled(ativo);
            btnP2Popularidade.setEnabled(ativo);
        }
    }

    // ==========================================
    // 3. CONTROLLER
    // ==========================================
    
    public static class JogoController {
        private final JogoModel model;
        private final JogoView view;

        public JogoController(JogoModel model, JogoView view) {
            this.model = model;
            this.view = view;

            registrarListeners();
            view.atualizarView(model);
        }

        private void registrarListeners() {
            // ActionListeners para atributos do Jogador 1
            view.getBtnP1Performance().addActionListener(e -> escolherAtributoP1("Performance"));
            view.getBtnP1Sintaxe().addActionListener(e -> escolherAtributoP1("Sintaxe"));
            view.getBtnP1Seguranca().addActionListener(e -> escolherAtributoP1("Segurança"));
            view.getBtnP1Longevidade().addActionListener(e -> escolherAtributoP1("Longevidade"));
            view.getBtnP1Popularidade().addActionListener(e -> escolherAtributoP1("Popularidade"));

            // ActionListeners para atributos do Jogador 2
            view.getBtnP2Performance().addActionListener(e -> escolherAtributoP2("Performance"));
            view.getBtnP2Sintaxe().addActionListener(e -> escolherAtributoP2("Sintaxe"));
            view.getBtnP2Seguranca().addActionListener(e -> escolherAtributoP2("Segurança"));
            view.getBtnP2Longevidade().addActionListener(e -> escolherAtributoP2("Longevidade"));
            view.getBtnP2Popularidade().addActionListener(e -> escolherAtributoP2("Popularidade"));

            // Botão de Próxima Rodada / Resolver Duelo
            view.getBtnProximaRodada().addActionListener(new ActionListener() {
                @Override
                public void actionPerformed(ActionEvent e) {
                    if (model.getTurnoAtual() == 3) {
                        // Calcula e processa o resultado do duelo
                        model.processarDuelo();
                        view.atualizarView(model);
                        model.setTurnoAtual(4); // Estado pós-confronto
                        view.getBtnProximaRodada().setText("Próxima Rodada");
                    } else if (model.getTurnoAtual() == 4) {
                        // Nova rodada: distribui novas cartas
                        model.distribuirCartas();
                        view.atualizarView(model);
                    }
                }
            });
        }

        private void escolherAtributoP1(String atributo) {
            int valor = model.getCartaAtualP1().getValorAtributo(atributo);
            model.registrarEscolhaP1(atributo, valor);
            view.atualizarView(model);
        }

        private void escolherAtributoP2(String atributo) {
            int valor = model.getCartaAtualP2().getValorAtributo(atributo);
            model.registrarEscolhaP2(atributo, valor);
            view.atualizarView(model);
        }
    }
}
