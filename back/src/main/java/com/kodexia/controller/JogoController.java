package com.kodexia.controller;

import com.kodexia.model.JogoModel;
import com.kodexia.view.JogoView;

import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

public class JogoController {
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
