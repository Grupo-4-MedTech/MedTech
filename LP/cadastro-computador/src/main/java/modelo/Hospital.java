package modelo;
import java.util.ArrayList;
import java.util.List;

public class Hospital {
    private int idHospital;
    private String nomeFantasia;
    private String razaoSocial;
    private String cnpj;
    private String senha;

    private static List<Hospital> listaHospital = new ArrayList<>();


    public Hospital(int idHospital, String nomeFantasia, String razaoSocial, String cnpj, String senha){
        this.idHospital = idHospital;
        this.nomeFantasia = nomeFantasia;
        this.razaoSocial = razaoSocial;
        this.cnpj = cnpj;
        this.senha = senha;
    }

    //Getters


    public int getIdHospital() {
        return this.idHospital;
    }

    public String getNomeFantasia() {
        return this.nomeFantasia;
    }

    public String getRazaoSocial() {
        return this.razaoSocial;
    }

    public String getCnpj() {
        return this.cnpj;
    }

    public String getSenha() {
        return this.senha;
    }

    public static List<Hospital> getListaHospital()
    {
        return listaHospital;
    }

    //Setters


    public void setIdHospital(int idHospital)
    {
        this.idHospital = idHospital;
    }

    public void setNomeFantasia(String nomeFantasia)
    {
        this.nomeFantasia = nomeFantasia;
    }

    public void setRazaoSocial(String razaoSocial)
    {
        this.razaoSocial = razaoSocial;
    }

    public void setCnpj(String cnpj)
    {
        this.cnpj = cnpj;
    }

    public void setSenha(String senha)
    {
        this.senha = senha;
    }

    public static void atualizarLista(Hospital hospital)
    {
        self:listaHospital.add(hospital);
    }
}
