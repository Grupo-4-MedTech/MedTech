package log;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;

public class LogManager {

    public static void salvarLog(Log log, int id) {

        try (BufferedWriter bw = new BufferedWriter(new FileWriter("logs.txt", true))) {
            bw.write("ID %d. ".formatted(id));
            bw.newLine();

            bw.write(log.toString());
            bw.newLine();

            bw.newLine();
            bw.write("----------------------------------------");
            bw.newLine();
        } catch (IOException e) {
            System.out.print("Erro: " + e.getMessage());
        }
    }
}
