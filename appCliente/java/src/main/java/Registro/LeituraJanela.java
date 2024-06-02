package Registro;

import com.github.britooo.looca.api.group.janelas.Janela;
import com.github.britooo.looca.api.group.janelas.JanelaGrupo;
import modelo.Computador;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class LeituraJanela extends Leitura{
    private List<Janela> listaGuias;


    // constructor

    public LeituraJanela(int fkComputador) {
        super(fkComputador);
        this.listaGuias = new ArrayList<>();
        realizarLeitura();
    }

    // outros métodos
    public void realizarLeitura(){
        JanelaGrupo janelaGrupo = looca.getGrupoDeJanelas();
        List<Janela> listaJanelas = janelaGrupo.getJanelas();
        for (Janela listaJanela : listaJanelas) {
            if (listaJanela.getTitulo().contains("Google Chrome") || listaJanela.getTitulo().contains("Edge") || listaJanela.getTitulo().contains("Firefox") || listaJanela.getTitulo().contains("Opera")) {
                listaGuias.add(listaJanela);
            }
        }
    }

    @Override
    public void inserirLeitura() {
        for (Janela janela : this.listaGuias) {
            String queryFerramenta =
                    "INSERT INTO leituraFerramenta (nomeApp, dtLeitura, caminho, fkComputador, fkDepartamento, fkHospital) VALUES( '"
                            + janela.getTitulo() + "', '"
                            + LocalDateTime.now() + "', '"
                            + janela.getComando() + "', "
                            + super.getFkComputador();

            System.out.printf("""
                        COMANDO DE INSERÇÃO DE LEITURAS DE FERRAMENTAS EM USO: \n
                        %s \n
                        """, queryFerramenta);
            conn.execute(queryFerramenta);
        }
    }
}
