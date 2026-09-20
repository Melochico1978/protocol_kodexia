package com.kodexia;

import com.kodexia.controller.JogoController;
import com.kodexia.model.JogoModel;
import com.kodexia.view.JogoView;

import javax.swing.*;

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
}
