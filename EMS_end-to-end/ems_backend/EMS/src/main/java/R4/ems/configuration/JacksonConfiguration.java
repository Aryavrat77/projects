package R4.ems.configuration;

import R4.ems.util.custom.CustomInstantDeserializer;
import com.fasterxml.jackson.databind.module.SimpleModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.threeten.bp.Instant;

@Configuration
public class JacksonConfiguration {

    @Bean
    public SimpleModule customInstantModule() {
        SimpleModule module = new SimpleModule();
        module.addDeserializer(Instant.class, new CustomInstantDeserializer());
        return module;
    }
}
