import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Input,
  Heading,
  Text,
  Image,
  Flex,
  Spinner,
  Grid,
  GridItem,
} from '@chakra-ui/react';

const Weather = () => {
  const [city, setCity] = useState('');
  const [currentWeather, setCurrentWeather] = useState(null);
  const [weeklyForecast, setWeeklyForecast] = useState([]);
  const [error, setError] = useState('');
  const [forecastTitle, setForecastTitle] = useState('');
  const [showSunTime, setShowSunTime] = useState('sunrise');
  const [loading, setLoading] = useState(false); // Estado de carregamento

  const apiKey = 'bd0a0174f3ec393ed4dcd34cf2197dfd';
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pt`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=pt`;

  const fetchWeather = async () => {
    setLoading(true); // Inicia o carregamento
    try {
      const [currentResponse, forecastResponse] = await Promise.all([
        axios.get(currentWeatherUrl),
        axios.get(forecastUrl),
      ]);

      setCurrentWeather(currentResponse.data);
      const { forecasts, title } = filterWeeklyForecast(forecastResponse.data.list);
      setWeeklyForecast(forecasts);
      setForecastTitle(title);
      setError('');
    } catch (err) {
      setError('Não foi possível obter os dados do clima. Verifique o nome da cidade e tente novamente.');
      setCurrentWeather(null);
      setWeeklyForecast([]);
      setForecastTitle('');
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  };

  const filterWeeklyForecast = (forecastList) => {
    const today = new Date();
    const todayDayOfWeek = today.getDay();
    const daysOfWeek = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    
    let filteredForecast = forecastList.filter(item => {
      const date = new Date(item.dt_txt);
      return date > today;
    });

    let title = '';
    if (todayDayOfWeek === 5) {
      filteredForecast = filteredForecast.filter(item => {
        const date = new Date(item.dt_txt);
        return date.getDay() === 6;
      });
      title = 'Previsão para o Dia Seguinte';
    } else if (todayDayOfWeek === 6) {
      filteredForecast = filteredForecast.slice(0, 6);
      title = 'Previsão para os Próximos 6 Dias';
    } else {
      title = 'Previsão para o Resto da Semana';
    }

    const forecastByDay = filteredForecast.reduce((acc, item) => {
      const date = new Date(item.dt_txt);
      const dayOfWeek = date.getDay();
      const dayName = daysOfWeek[dayOfWeek];
      
      if (!acc[dayName]) {
        acc[dayName] = {
          temp: item.main.temp,
          feels_like: item.main.feels_like,
          humidity: item.main.humidity,
          visibility: item.visibility,
          description: item.weather[0].description,
          icon: item.weather[0].icon,
          precipitation: item.rain ? item.rain['3h'] || 0 : 0,
        };
      }
      
      return acc;
    }, {});

    return {
      forecasts: Object.entries(forecastByDay).map(([day, data]) => ({
        day,
        ...data,
      })),
      title,
    };
  };

  const getWeatherIconUrl = (iconCode) => {
    return `http://openweathermap.org/img/wn/${iconCode}.png`;
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      p={4}
      bg="orange.50" // Ajuste a cor de fundo aqui
    >
      <Box
        width="100%"
        maxWidth="1200px"
        p={4}
        borderWidth={1}
        borderRadius="md"
        boxShadow="md"
        bg="white"
      >
        <Heading mb={4}>Consulta de Clima</Heading>
        <Box mb={4}>
          <Input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Digite o nome da cidade"
            mb={2}
          />
          <Button onClick={fetchWeather} variant="solid" width="100%" isDisabled={loading}>
            {loading ? 'Pesquisando...' : 'Buscar'}
          </Button>
        </Box>

        {error && <Text color="red.500" mb={4}>{error}</Text>}

        {loading && !error && (
          <Flex justify="center" align="center" my={4}>
            <Spinner size="xl" />
            <Text ml={4}>Pesquisando...</Text>
          </Flex>
        )}

        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6} mb={8}>
          {currentWeather && (
            <GridItem>
              <Box mb={4}>
                <Heading size="md" mb={2}>
                  Clima Atual em {currentWeather.name}
                </Heading>
                
                {/* Distribuição de Temperatura e Sensação Térmica */}
                <Flex direction="column" align="start" mb={4}>
                  <Text mb={2}>Temperatura: {currentWeather.main.temp}°C</Text>
                  <Text>Sensação Térmica: {currentWeather.main.feels_like}°C</Text>
                </Flex>

                {/* Informações sobre umidade, visibilidade e precipitação */}
                <Box mb={4}>
                  <Text mb={2}>Umidade: {currentWeather.main.humidity}%</Text>
                  <Text mb={2}>Visibilidade: {currentWeather.visibility / 1000} km</Text>
                  <Text>Precipitação: {currentWeather.rain ? currentWeather.rain['1h'] || 0 : 0} mm</Text>
                </Box>

                {/* Icone do Clima Atual */}
                <Flex direction="column" align="center" mb={4}>
                  <Image src={getWeatherIconUrl(currentWeather.weather[0].icon)} alt="Ícone do clima atual" boxSize="100px" />
                </Flex>
              </Box>
            </GridItem>
          )}

          {weeklyForecast.length > 0 && (
            <GridItem>
              <Box>
                <Heading size="md" mb={2}>
                  {forecastTitle}
                </Heading>
                {weeklyForecast.map((item) => (
                  <Box key={item.day} p={4} borderWidth={1} borderRadius="md" mb={4}>
                    <Heading size="sm">{item.day}</Heading>
                    <Text>Temperatura: {item.temp}°C</Text>
                    <Image src={getWeatherIconUrl(item.icon)} alt={`Ícone do clima para ${item.day}`} boxSize="50px" />
                  </Box>
                ))}
              </Box>
            </GridItem>
          )}
        </Grid>

        {/* Centralização do Conjunto do Sol */}
        {currentWeather && (
          <Flex direction="column" align="center" mb={4}>
            <Box>
              <Text mb={2}>
                {showSunTime === 'sunrise' ? `Nascer do Sol: ${formatTime(currentWeather.sys.sunrise)}` : `Pôr do Sol: ${formatTime(currentWeather.sys.sunset)}`}
              </Text>
              <Button
                onClick={() => setShowSunTime(showSunTime === 'sunrise' ? 'sunset' : 'sunrise')}
                variant="outline"
              >
                {showSunTime === 'sunrise' ? 'Ver Pôr do Sol' : 'Ver Nascer do Sol'}
              </Button>
            </Box>
          </Flex>
        )}
      </Box>
    </Box>
  );
};

export default Weather;
