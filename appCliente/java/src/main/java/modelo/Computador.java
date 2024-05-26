package modelo;



import com.github.britooo.looca.api.core.Looca;
import com.github.britooo.looca.api.group.discos.DiscoGrupo;
import com.github.britooo.looca.api.group.discos.Volume;
import com.github.britooo.looca.api.group.janelas.Janela;
import com.github.britooo.looca.api.group.janelas.JanelaGrupo;
import com.github.britooo.looca.api.group.memoria.Memoria;
import com.github.britooo.looca.api.util.Conversor;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

public class Computador {
    private int idComputador;
    private String nome;
    private String modeloProcessador;
    private String codPatrimonio;
    private int maxRam;
    private int maxDisco;

    private int fkDepartamento;

    private int fkHospital;
    private Departamento departamento;

    Looca looca = new Looca();
    Memoria memoria = looca.getMemoria();

    DiscoGrupo grupoDeDiscos = looca.getGrupoDeDiscos();
    List<Volume> volumes = grupoDeDiscos.getVolumes();
    List<Long> porcentagemVolumes = new ArrayList<>();

    public Computador(int idComputador, String modeloProcessador,  String nome, String codPatrimonio, int maxRam, int maxDisco)
    {
        this.idComputador      = idComputador;
        this.modeloProcessador = modeloProcessador;
        this.nome              = nome;
        this.codPatrimonio     = codPatrimonio;
        this.maxRam            = maxRam;
        this.maxDisco          = maxDisco;
    }

    public Computador(){
        this.departamento = new Departamento();
    }

    //GETTERS
    public String getQuantidadeMaximaMemoria(){
        return Conversor.formatarBytes(memoria.getTotal());
    }

    public String getUsoMemoria(){
        return Conversor.formatarBytes(memoria.getEmUso());
    }

    public Double getPorcentagemConsumoMemoria(){
        return memoria.getEmUso() * 100.0 / memoria.getTotal();
    }


    List<Janela> listaGuias = new ArrayList<>();
    public List<Janela> getJanelas() {
        JanelaGrupo janelaGrupo = looca.getGrupoDeJanelas();
        List<Janela> listaJanelas = janelaGrupo.getJanelas();
        for (Janela listaJanela : listaJanelas) {
            if (listaJanela.getTitulo().contains("Google Chrome") || listaJanela.getTitulo().contains("Edge") || listaJanela.getTitulo().contains("Firefox") || listaJanela.getTitulo().contains("Opera")) {
                listaGuias.add(listaJanela);
            }
        }
        return listaGuias;
    }

    public List<Long> getPorcentagemDeTodosVolumes(){
        for (Volume volume : volumes) {
            if(volume.getTotal() > 0){
                porcentagemVolumes.add((volume.getTotal() - volume.getDisponivel()) * 100 / volume.getTotal());
            }
        }
        return porcentagemVolumes;
    }

    // percorrer a lista de % de consumo de discos e pegar o maior número da lista
    public Double getDiscoComMaisConsumo(List<Long>porcentagemVolumes){
        Optional<Double> menorPorcentDisco = porcentagemVolumes.stream()
                .map(e -> e.doubleValue())
                .max(Comparator.naturalOrder());

        return menorPorcentDisco.get();
    }

    public String getNomeProcessador(){
        return looca.getProcessador().getNome();
    }
    public Integer getCpusFisicas(){
        return looca.getProcessador().getNumeroCpusFisicas();
    }
    public Integer getCpusLogicas(){
        return looca.getProcessador().getNumeroCpusLogicas();
    }
    public Double getPorcentagemConsumoCpu(){
        return looca.getProcessador().getUso();
    }

    public int getIdComputador() {
        return this.idComputador;
    }
    public int getMaxDisco() {
        return this.maxDisco;
    }

    public Departamento getDepartamento(){
        return this.departamento;
    }

    public String getNome() {
        return nome;
    }

    public int getFkHospital() {
        return fkHospital;
    }

    public int getFkDepartamento() {
        return fkDepartamento;
    }

    //SETTERS

    public void setCodPatrimonio(String codPatrimonio) {
        this.codPatrimonio = codPatrimonio;
    }

    public void setMaxDisco(int maxDisco) {
        this.maxDisco = maxDisco;
    }

    public void setMaxRam(int maxRam) {
        this.maxRam = maxRam;
    }

    public void setModeloProcessador(String modeloProcessador) {
        this.modeloProcessador = modeloProcessador;
    }
    

    public void setDepartamento(Departamento departamento) {
        this.departamento = departamento;
        departamento.addComputador(this);
    }
    public void setIdComputador(int idComputador) {
        this.idComputador = idComputador;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public void setFkDepartamento(int fkDepartamento) {
        this.fkDepartamento = fkDepartamento;
    }

    public void setFkHospital(int fkHospital) {
        this.fkHospital = fkHospital;
    }

    @Override
    public String toString() {
        return
                  "========================================COMPUTADOR========================================" + "\n"
                + "Nome do computador: " + this.nome + "\n"
                + "Código do patrimônio: " + this.codPatrimonio + "\n"
                + "Modelo da CPU: " + this.modeloProcessador + "\n"
                + "Capacidade máxima da RAM: " + this.maxRam + "GB \n"
                + "Capacidade máxima do Disco: " + this.maxDisco + "GB \n"
                + "========================================DEPARTAMENTO========================================" + "\n"
                + "Identificador do departamento: " + this.departamento.getIdDepartamento() + "\n"
                + "Nome do departamento: " + this.departamento.getNome() + "\n"
                + "========================================HOSPITAL========================================" + "\n"
                + "Nome fantasia: " + this.departamento.getHospital().getNomeFantasia() + "\n"
                + "Razão social: " + this.departamento.getHospital().getRazaoSocial() + "\n"
                + "CNPJ:" + this.departamento.getHospital().getCnpj();
    }


}
