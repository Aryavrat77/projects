package com.R4.EMS.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.format.support.DefaultFormattingConversionService;
import org.springframework.format.support.FormattingConversionService;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {

    private static final Logger logger = LoggerFactory.getLogger(WebConfig.class);

    @Autowired
    private Environment environment;

    @Bean
    public CommandLineRunner printServerPort() {
        return args -> {
            String port = environment.getProperty("local.server.port");
            if (port != null) {
                logger.info("Application is running on port: {}", port);
            } else {
                logger.warn("Server port property not found.");
            }
        };
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        try {
            registry.addMapping("/**")
                    .allowedOrigins("http://54.186.43.199:3000") // FRONT END CONTAINER FOR END TO END DEPLOYMENT
                //    .allowedOrigins("http://localhost:3000")
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true);
        } catch (Exception e) {
            logger.error("Error configuring CORS: {}", e.getMessage());
        }
    }

    @Bean
    public FormattingConversionService mvcConversionService() {
        return new DefaultFormattingConversionService();
    }

    @Bean
    @Order(Ordered.HIGHEST_PRECEDENCE)
    public CorsFilter corsFilter() {
        try {
            UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
            CorsConfiguration config = new CorsConfiguration();
            config.setAllowCredentials(true);
            config.addAllowedOrigin("http://54.186.43.199:3000");
            config.addAllowedHeader("*");
            config.addAllowedMethod("*");
            source.registerCorsConfiguration("/**", config);
            return new CorsFilter(source);
        } catch (Exception e) {
            logger.error("Error creating CORS filter: {}", e.getMessage());
            return new CorsFilter(source -> new CorsConfiguration()); // Return an empty filter on error
        }
    }

    @Bean
    public Filter customErrorFilter() {
        return new Filter() {
            @Override
            public void init(FilterConfig filterConfig) throws ServletException {
                // Initialization logic if needed
            }

            @Override
            public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
                HttpServletRequest req = (HttpServletRequest) request;
                HttpServletResponse res = (HttpServletResponse) response;

                try {
                    chain.doFilter(request, response);
                } catch (Exception e) {
                    logger.error("Unhandled exception: {}", e.getMessage());
                    res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                    res.setContentType("application/json");
                    res.getWriter().write(createErrorResponse(e, req));
                }
            }

            @Override
            public void destroy() {
                // Cleanup logic if needed
            }

            private String createErrorResponse(Exception e, HttpServletRequest req) {
                String errorMessage = "Internal Server Error. ";
                
                if ("OPTIONS".equalsIgnoreCase(req.getMethod())) {
                    errorMessage += "CORS preflight request failed. Ensure that the necessary CORS headers are configured correctly.\n";
                }
                
                errorMessage += "Details: " + e.getMessage() + "\n";
                errorMessage += "Check the following configurations:\n";
                errorMessage += "1. Ensure the 'allowedOrigins' is set to 'http://54.213.40.3:3000' in your CORS configuration.\n";
                errorMessage += "2. Ensure the backend server is accessible and running.\n";
                errorMessage += "3. Verify the request URL and endpoint path.\n";
                errorMessage += "4. Ensure proper headers are included in the request, such as 'Content-Type' and 'Authorization' if needed.\n";
                
                return "{ \"error\": \"" + errorMessage + "\" }";
            }
        };
    }
}
