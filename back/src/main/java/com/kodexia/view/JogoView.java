package com.kodexia.view;

import com.kodexia.model.JogoModel;

import javax.swing.*;
import java.awt.*;

public class JogoView extends JFrame {
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
