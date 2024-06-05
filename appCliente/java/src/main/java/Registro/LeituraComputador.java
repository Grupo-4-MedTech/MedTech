package Registro;

import com.github.britooo.looca.api.group.discos.DiscoGrupo;
import com.github.britooo.looca.api.group.discos.Volume;
import com.github.britooo.looca.api.group.memoria.Memoria;
import com.github.britooo.looca.api.util.Conversor;
import modelo.Computador;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

public class LeituraComputador extends Leitura{
    private Integer qtdCpusLogicas;
    private Integer qtdCpusFisicas;
    private String usoMemoria;
    private Double porcentagemConsumoMemoria;
    private String nomeProcessador;
    private String qtdMaximaMemoria;
    private Double porcentagemConsumosCpus;
    private Double menorPorcentDisco;

    public String getNomeProcessador() {
        return nomeProcessador;
    }

    public Double getPorcentagemConsumosCpus() {
        return porcentagemConsumosCpus;
    }

    public Double getPorcentagemConsumoMemoria() {
        return porcentagemConsumoMemoria;
    }

    private Memoria memoria = looca.getMemoria();
    private DiscoGrupo grupoDeDiscos = looca.getGrupoDeDiscos();
    private List<Volume> volumes = grupoDeDiscos.getVolumes();
    private List<Long> porcentagemVolumes;

    // constructor

    public LeituraComputador(int fkComputador) {
        super(fkComputador);
        this.porcentagemVolumes = new ArrayList<>();
        realizarLeitura();
    }

    // outros métodos

    public void realizarLeitura(){
        this.qtdMaximaMemoria = Conversor.formatarBytes(memoria.getTotal());
        this.usoMemoria = Conversor.formatarBytes(memoria.getEmUso());
        this.porcentagemConsumoMemoria = memoria.getEmUso() * 100.0 / memoria.getTotal();

        for (Volume volume : volumes) {
            if(volume.getTotal() > 0){
                porcentagemVolumes.add((volume.getTotal() - volume.getDisponivel()) * 100 / volume.getTotal());
            }
        }

        // percorrer a lista de % de consumo de discos e pegar o maior número da lista
        Optional<Double> menorPorcentDisco = porcentagemVolumes.stream()
                .map(e -> e.doubleValue())
                .max(Comparator.naturalOrder());

        this.menorPorcentDisco = menorPorcentDisco.get();

        this.nomeProcessador = looca.getProcessador().getNome();
        this.qtdCpusFisicas = looca.getProcessador().getNumeroCpusFisicas();
        this.qtdCpusLogicas = looca.getProcessador().getNumeroCpusLogicas();
        this.porcentagemConsumosCpus = looca.getProcessador().getUso();
    }

    @Override
    public void inserirLeitura() throws InterruptedException{
    // fazer inserção da leitura no banco

        for (int i = 1; true; i++) {

            String queryRamCpu = "INSERT INTO leituraRamCpu (ram, cpu, dataLeitura, fkComputador, fkDepartamento, fkHospital) VALUES("
                + this.porcentagemConsumoMemoria
                + ", " + this.porcentagemConsumosCpus
                + ", '" + LocalDateTime.now() + "', " + super.getFkComputador();

            System.out.printf("""
                    COMANDO DE INSERÇÃO DE LEITURAS DE RAM E CPU:
                    %s \n
                    """, queryRamCpu);
            conn.execute(queryRamCpu);

            if (i > 9) {
                String queryDisco = "INSERT INTO leituraDisco (disco, dataLeitura, fkComputador, fkDepartamento, fkHospital) VALUES ("
                        + this.menorPorcentDisco
                        + "," + super.getFkComputador();

                System.out.printf("""
                        COMANDO DE INSERÇÃO DE LEITURAS DE FERRAMENTAS EM USO: \n
                        %s \n
                        """, queryDisco);
                conn.execute(queryDisco);

                i = 0;
            }
            Thread.sleep(3000);
        }
    }
}