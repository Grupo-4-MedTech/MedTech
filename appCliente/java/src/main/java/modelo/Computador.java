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


    public String getCodPatrimonio() {
        return codPatrimonio;
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

    public int getMaxRam(){return  getMaxDisco();}

    //SETTERS

    public void setDepartamento(Departamento departamento) {
        this.departamento = departamento;
        departamento.addComputador(this);
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
