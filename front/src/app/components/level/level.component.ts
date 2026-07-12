import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../services/loading.service';

@Component({
  standalone: true,
  selector: 'app-level',
  imports: [FormsModule, CommonModule],
  templateUrl: './level.component.html',
  styleUrl: './level.component.css'
})
export class LevelComponent implements OnInit {
  router = inject(Router);
  route = inject(ActivatedRoute);
  loading = inject(LoadingService);

  levelId = '1';
  userCode = '';
  executionState = signal<'idle' | 'executing' | 'success' | 'error'>('idle');

  
  levelsData: any = {
    '1': {
      titulo: 'Autenticação Master',
      contexto: 'Precisamos usar o novo registro master enviado pelo professor para acessar o terminal por completo e seguirmos em frente! Em Java, devemos definir explicitamente o tipo de cada dado. Nossa missão é criar três variáveis para autenticar o login:',
      instrucoesHtml: `
        <ul style="font-size: 18px; color: #ccc; margin-top: 10px; line-height: 1.5;">
          <li>Uma <span style="color: #00f3ff;">String</span> chamada <span style="color: #00f3ff;">nome</span> com o valor <span style="color: #00ff41;">"Zero N"</span>.</li>
          <li>Um número inteiro (<span style="color: #fcee0a;">int</span>) chamado <span style="color: #fcee0a;">registro</span> com o valor <span style="color: #00ff41;">404</span>.</li>
          <li>Uma <span style="color: #00f3ff;">String</span> chamada <span style="color: #00f3ff;">seguranca</span> com o valor <span style="color: #00ff41;">"Fluffy"</span>.</li>
        </ul>
      `,
      dicaSyntaxHtml: `
        <span style="color: #00ff41;">String variavelTexto = "Texto";</span><br>
        <span style="color: #00ff41;">int variavelNumero = 10;</span>
      `,
      mentor: 'MIRABERTO',
      mentorImg: 'assets/images/miraberto.jpeg',
      mentorFala: '"Ah, a verificação de duas etapas... Fui eu quem configurei isso há anos. Quem diria que o nome do meu cachorro-robô, Fluffy, seria a chave mestra? Lembre-se: textos levam aspas, números não! E feche cada linha com ;"',
      erroMsg: 'Dica: Verifique se declarou "nome", "registro" e "seguranca" corretamente com seus respectivos tipos (String e int) e valores.',
      validate: (code: string) => {
        return code.includes('String nome') && code.includes('"Zero N"') &&
          code.includes('int registro') && code.includes('404') &&
          code.includes('String seguranca') && code.includes('"Fluffy"') &&
          code.includes(';');
      }
    },
    '2': {
      titulo: 'Alocação de Memória',
      contexto: 'Precisamos alocar um Array na memória para organizar nossas defesas! Em Java, coleções como Arrays precisam ter seu tipo definido. Nossa missão é instanciar um Array de textos:',
      instrucoesHtml: `
        <ul style="font-size: 18px; color: #ccc; margin-top: 10px; line-height: 1.5;">
          <li>Declare um Array de <span style="color: #00f3ff;">String</span>.</li>
          <li>O nome do array deve ser <span style="color: #00f3ff;">cartas</span>.</li>
          <li>O array deve ser inicializado contendo as palavras <span style="color: #00ff41;">"Virus"</span> e <span style="color: #00ff41;">"Rootkit"</span>.</li>
        </ul>
      `,
      dicaSyntaxHtml: `
        <span style="color: #00ff41;">String[] meuArray = {"Valor1", "Valor2"};</span>
      `,
      mentor: 'MIRABERTO',
      mentorImg: 'assets/images/miraberto.jpeg',
      mentorFala: '"Arrays em Java usam colchetes depois do tipo, como em String[]. E para criar com os valores direto na mesma linha, usamos as chaves {}. Lembre de fechar com ponto-e-vírgula!"',
      erroMsg: 'Dica: Você usou String[] cartas = {"Virus", "Rootkit"}; corretamente?',
      validate: (code: string) => {
        return code.includes('String[]') && code.includes('cartas') &&
          code.includes('"Virus"') && code.includes('"Rootkit"') &&
          code.includes(';');
      }
    },
    '3': {
      titulo: 'Fluxo de Controle',
      contexto: 'As defesas do sistema precisam de um gatilho. Vamos usar a lógica condicional IF para verificar uma falha crítica!',
      instrucoesHtml: `
        <ul style="font-size: 18px; color: #ccc; margin-top: 10px; line-height: 1.5;">
          <li>Crie uma estrutura <span style="color: #fcee0a;">if</span>.</li>
          <li>A condição deve verificar se <span style="color: #00f3ff;">vida <= 0</span>.</li>
          <li>Dentro do if, execute algo. (Ex: System.out.println("Vitoria");)</li>
        </ul>
      `,
      dicaSyntaxHtml: `
        <span style="color: #fcee0a;">if (condicao) { <br> &nbsp;&nbsp;
      `,
      mentor: 'MIRABERTO',
      mentorImg: 'assets/images/miraberto.jpeg',
      mentorFala: '"Estruturas de decisão são o coração da lógica de máquina! Coloque a condição entre parênteses e o bloco a ser executado entre chaves {}. Não esqueça do menor ou igual (<=) !"',
      erroMsg: 'Dica: Verifique se você escreveu if (vida <= 0) { ... }',
      validate: (code: string) => {
        
        const c = code.replace(/\s+/g, '');
        return c.includes('if(vida<=0)') || (code.includes('if') && code.includes('vida') && code.includes('<=') && code.includes('0'));
      }
    }
  };

  currentLevelData: any;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.levelId = params.get('id') || '1';
      this.currentLevelData = this.levelsData[this.levelId];
      
      if (!this.currentLevelData) {
        this.currentLevelData = this.levelsData['1'];
      }
    });
  }

  async executeCode() {
    if (!this.userCode.trim()) return;

    this.executionState.set('executing');

    
    await new Promise(resolve => setTimeout(resolve, 1500));

    const code = this.userCode.trim();

    
    const isValid = this.currentLevelData.validate(code);

    if (isValid) {
      this.executionState.set('success');

      
      const nivelAtual = parseInt(localStorage.getItem('kodexia_story_progress') || '1', 10);
      const targetNext = parseInt(this.levelId) + 1;
      if (nivelAtual < targetNext && targetNext <= 4) {
        localStorage.setItem('kodexia_story_progress', targetNext.toString());
      }

      
      setTimeout(() => {
        this.loading.adicionarItemLoading('retornando-mapa');

        setTimeout(() => {
          this.loading.removerItemLoading('retornando-mapa');
          this.router.navigate(['/story/map']);
        }, 2000);

      }, 3000);
    } else {
      this.executionState.set('error');
    }
  }
}