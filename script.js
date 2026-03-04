/**
 * Infográfico Tunnel Vision - Caso Mairlon
 * Lógica completa de interação e visualização
 * @version 2.0
 */

// ===== CONFIGURAÇÃO DOS DADOS =====
const CONFIG = {
    fases: [
        {
            id: 0,
            titulo: "0–24h: Fixação inicial",
            progresso: 10,
            vies: 15,
            eventos: [
                { icone: "🎯", texto: "Polícia identifica suspeito com base em denúncia anônima", tipo: "critical" },
                { icone: "📸", texto: "Reconhecimento fotográfico informal (única foto)", tipo: "critical" },
                { icone: "🚫", texto: "Outras linhas investigativas descartadas", tipo: "critical" }
            ],
            evidencias: [
                { texto: "Denúncia anônima: 'um homem de boné vermelho'", tag: "frágil", critical: true },
                { texto: "Reconhecimento por WhatsApp (apenas uma foto)", tag: "nulo", critical: true },
                { texto: "Suspeito tem passagem por furto (2018)", tag: "antecedente", critical: false }
            ],
            pillars: {
                policia: "Foco exclusivo em Mairlon",
                mp: "Não envolvido",
                jud: "Sem atuação",
                pericia: "Não acionada"
            },
            notaVies: "Hipótese única formada nas primeiras horas. Viés de confirmação incipiente."
        },
        {
            id: 1,
            titulo: "24h–7d: Reforço seletivo",
            progresso: 40,
            vies: 45,
            eventos: [
                { icone: "🔍", texto: "Testemunha reconhece suspeito em foto (procedimento sugestivo)", tipo: "critical" },
                { icone: "📑", texto: "Investigadores reinterpretam álibi como 'mentira'", tipo: "critical" },
                { icone: "⚖️", texto: "MP requisita prisão preventiva", tipo: "institucional" }
            ],
            evidencias: [
                { texto: "Reconhecimento pessoal sem blinding (testemunha vê suspeito algemado)", tag: "viciado", critical: true },
                { texto: "Álibi: estava em casa com a mãe (não investigado)", tag: "ignorado", critical: true },
                { texto: "Prisão preventiva decretada", tag: "MP", critical: false }
            ],
            pillars: {
                policia: "Convencida da culpa",
                mp: "Oferece denúncia",
                jud: "Decreta prisão",
                pericia: "Laudo em andamento"
            },
            notaVies: "Evidências que contradizem a hipótese são ignoradas. Viés de confirmação em ação."
        },
        {
            id: 2,
            titulo: "7d–30d: Cegueira institucional",
            progresso: 75,
            vies: 80,
            eventos: [
                { icone: "🧪", texto: "Laudo pericial não encontra DNA do suspeito (ignorado)", tipo: "critical" },
                { icone: "👥", texto: "Instituições alinhadas: 'caso sólido'", tipo: "institucional" },
                { icone: "📉", texto: "Defesa apresenta provas de álibi (desconsideradas)", tipo: "critical" }
            ],
            evidencias: [
                { texto: "Exame de DNA: amostra na cena não pertence ao suspeito", tag: "excludente", critical: true },
                { texto: "Promotor: 'DNA pode ser de contaminação'", tag: "reinterpretação", critical: true },
                { texto: "Testemunhas de defesa não ouvidas", tag: "cerceamento", critical: false }
            ],
            pillars: {
                policia: "Investigação tunnel",
                mp: "Sustenta denúncia",
                jud: "Recebe denúncia",
                pericia: "Laudo conclusivo, mas ignorado"
            },
            notaVies: "Reinterpretação hierárquica de provas exculpatórias. D=0,61 (Elaad, 2022)."
        },
        {
            id: 3,
            titulo: "30d–condenação: Consolidação",
            progresso: 100,
            vies: 98,
            eventos: [
                { icone: "🔨", texto: "Julgamento baseado em reconhecimento viciado", tipo: "critical" },
                { icone: "📜", texto: "Sentença condenatória: 'conjunto probatório robusto'", tipo: "institucional" },
                { icone: "🔒", texto: "Pena de 12 anos", tipo: "final" }
            ],
            evidencias: [
                { texto: "Sentença cita apenas provas incriminatórias", tag: "seletividade", critical: true },
                { texto: "STJ nega HC: 'revisão de provas'", tag: "tribunal", critical: true },
                { texto: "Mairlon preso preventivamente há 2 anos", tag: "cumprimento", critical: false }
            ],
            pillars: {
                policia: "Caso encerrado",
                mp: "Recursos contra absolvição",
                jud: "Condenação confirmada",
                pericia: "Laudo ignorado"
            },
            notaVies: "Tunnel vision institucionalizado. Hindsight bias na revisão."
        }
    ],
    referencias: {
        vieses: [
            "Viés de confirmação (confirmation bias)",
            "Viés de familiaridade",
            "Viés de autoridade",
            "Hindsight bias",
            "Viés de disponibilidade"
        ],
        ferramentas: [
            "CEAP 2.0",
            "Protocolo de blinding",
            "Entrevista cognitiva",
            "Análise de álibi"
        ]
    }
};

// ===== ESTADO DA APLICAÇÃO =====
class TunnelVisionApp {
    constructor() {
        this.faseAtual = 0;
        this.totalFases = CONFIG.fases.length;
        this.elementos = {};
        this.historic = [];
        this.init();
    }

    init() {
        this.cacheElements();
        this.attachEvents();
        this.atualizarFase(this.faseAtual);
        this.initAnalytics();
    }

    cacheElements() {
        this.elementos = {
            phaseBtns: document.querySelectorAll('.phase-btn'),
            pathProgress: document.getElementById('pathProgress'),
            biasBar: document.getElementById('biasBar'),
            biasPercentage: document.getElementById('biasPercentage'),
            biasNote: document.getElementById('biasNote'),
            eventCards: document.getElementById('eventCards'),
            evidenceList: document.getElementById('evidenceList'),
            phaseIndicator: document.getElementById('phaseIndicator'),
            pillarPolicia: document.getElementById('pillarPolicia'),
            pillarMP: document.getElementById('pillarMP'),
            pillarJud: document.getElementById('pillarJud'),
            pillarPericia: document.getElementById('pillarPericia'),
            markers: document.querySelectorAll('.marker'),
            pillars: document.querySelectorAll('.pillar'),
            prevBtn: document.getElementById('prevPhase'),
            nextBtn: document.getElementById('nextPhase')
        };
    }

    attachEvents() {
        // Botões das fases
        this.elementos.phaseBtns.forEach((btn, idx) => {
            btn.addEventListener('click', () => this.irParaFase(idx));
        });

        // Controles anterior/próximo
        this.elementos.prevBtn.addEventListener('click', () => {
            this.faseAtual = (this.faseAtual - 1 + this.totalFases) % this.totalFases;
            this.atualizarFase(this.faseAtual);
            this.logInteracao('navegacao', 'prev', this.faseAtual);
        });

        this.elementos.nextBtn.addEventListener('click', () => {
            this.faseAtual = (this.faseAtual + 1) % this.totalFases;
            this.atualizarFase(this.faseAtual);
            this.logInteracao('navegacao', 'next', this.faseAtual);
        });

        // Clique em cards (highlight)
        document.addEventListener('click', (e) => {
            const card = e.target.closest('.evidence-item');
            if (card) {
                card.classList.toggle('highlight');
                this.logInteracao('card_click', card.innerText.slice(0, 50));
            }
        });

        // Teclado (setas)
        window.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.elementos.prevBtn.click();
            } else if (e.key === 'ArrowRight') {
                this.elementos.nextBtn.click();
            }
        });

        // Touch events para mobile
        let touchStartX = 0;
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        document.addEventListener('touchend', (e) => {
            if (!touchStartX) return;
            const diff = e.changedTouches[0].screenX - touchStartX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.elementos.prevBtn.click();
                } else {
                    this.elementos.nextBtn.click();
                }
            }
        });
    }

    irParaFase(index) {
        this.faseAtual = index;
        this.atualizarFase(index);
        this.logInteracao('fase_click', null, index);
    }

    atualizarFase(index) {
        const fase = CONFIG.fases[index];

        // Atualizar botões
        this.elementos.phaseBtns.forEach((btn, i) => {
            btn.classList.toggle('active', i === index);
        });

        // Barra de progresso
        this.elementos.pathProgress.style.width = fase.progresso + '%';

        // Medidor de viés
        this.elementos.biasBar.style.width = fase.vies + '%';
        this.elementos.biasPercentage.textContent = fase.vies + '%';
        this.elementos.biasNote.textContent = fase.notaVies;

        // Eventos
        this.renderEventos(fase.eventos);
        this.renderEvidencias(fase.evidencias);

        // Pilares
        this.atualizarPillars(fase.pillars, index);

        // Marcadores
        this.elementos.markers.forEach((marker, i) => {
            marker.classList.toggle('active', i <= index + 1);
        });

        // Indicador de fase
        this.elementos.phaseIndicator.textContent = `Fase ${index+1}: ${fase.titulo}`;

        // Efeito visual de transição
        this.elementos.eventCards.style.animation = 'none';
        this.elementos.eventCards.offsetHeight;
        this.elementos.eventCards.style.animation = 'slideIn 0.3s ease-out';
    }

    renderEventos(eventos) {
        this.elementos.eventCards.innerHTML = '';
        eventos.forEach(ev => {
            const card = document.createElement('div');
            card.className = `evidence-item ${ev.tipo === 'critical' ? 'critical' : ''}`;
            card.innerHTML = `
                <span class="evidence-tag">${ev.icone}</span>
                <span>${ev.texto}</span>
            `;
            this.elementos.eventCards.appendChild(card);
        });
    }

    renderEvidencias(evidencias) {
        this.elementos.evidenceList.innerHTML = '';
        evidencias.forEach(ev => {
            const li = document.createElement('li');
            li.className = `evidence-item ${ev.critical ? 'critical' : ''}`;
            li.innerHTML = `
                <span class="evidence-tag">${ev.tag}</span>
                <span>${ev.texto}</span>
            `;
            this.elementos.evidenceList.appendChild(li);
        });
    }

    atualizarPillars(pillars, index) {
        this.elementos.pillarPolicia.textContent = pillars.policia;
        this.elementos.pillarMP.textContent = pillars.mp;
        this.elementos.pillarJud.textContent = pillars.jud;
        this.elementos.pillarPericia.textContent = pillars.pericia;

        // Destacar pilares ativos
        this.elementos.pillars.forEach(p => p.classList.remove('active'));
        document.querySelector('[data-pillar="policia"]').classList.add('active');
        
        if (index >= 1) {
            document.querySelector('[data-pillar="mp"]').classList.add('active');
        }
        if (index >= 2) {
            document.querySelector('[data-pillar="jud"]').classList.add('active');
            document.querySelector('[data-pillar="pericia"]').classList.add('active');
        }
    }

    logInteracao(tipo, detalhe, valor) {
        const log = {
            timestamp: new Date().toISOString(),
            tipo,
            detalhe,
            valor,
            fase: this.faseAtual
        };
        this.historic.push(log);
        
        // Opcional: enviar para analytics
        if (typeof ga !== 'undefined') {
            ga('send', 'event', 'infografico', tipo, detalhe, valor);
        }
        
        console.log('Interação:', log);
    }

    initAnalytics() {
        // Tempo de visualização
        const startTime = Date.now();
        window.addEventListener('beforeunload', () => {
            const timeSpent = Math.round((Date.now() - startTime) / 1000);
            this.logInteracao('tempo_total', 'segundos', timeSpent);
        });
    }

    // Exportar dados para relatório
    exportarDados() {
        const dados = {
            historico: this.historic,
            config: CONFIG,
            timestamp: new Date().toISOString()
        };
        return JSON.stringify(dados, null, 2);
    }
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
    window.app = new TunnelVisionApp();
    
    // Botão de exportação (opcional)
    const exportBtn = document.createElement('button');
    exportBtn.textContent = '📊 Exportar Dados';
    exportBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #2a344a;
        color: white;
        border: 1px solid #ffb347;
        padding: 10px 20px;
        border-radius: 30px;
        cursor: pointer;
        z-index: 1000;
        font-size: 0.9rem;
    `;
    exportBtn.onclick = () => {
        const dados = window.app.exportarDados();
        const blob = new Blob([dados], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tunnel-vision-${new Date().toISOString().slice(0,10)}.json`;
        a.click();
    };
    document.body.appendChild(exportBtn);
});
