package R4.ems.util.custom;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import org.threeten.bp.Instant;
import org.threeten.bp.format.DateTimeFormatter;

import java.io.IOException;

public class CustomInstantDeserializer extends JsonDeserializer<Instant> {

    private DateTimeFormatter formatter;

    public CustomInstantDeserializer() {
        this.formatter = DateTimeFormatter.ISO_INSTANT;
    }

    public CustomInstantDeserializer(DateTimeFormatter formatter) {
        this.formatter = formatter;
    }

    @Override
    public Instant deserialize(JsonParser p, DeserializationContext ctxt) throws IOException, JsonProcessingException {
        String date = p.getText();
        return Instant.from(formatter.parse(date));
    }
}
