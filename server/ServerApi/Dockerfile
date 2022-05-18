FROM mcr.microsoft.com/dotnet/aspnet:6.0-focal AS base
# WORKDIR /app
# EXPOSE 5000

# ENV ASPNETCORE_URLS=http://+:5000

# # Creates a non-root user with an explicit UID and adds permission to access the /app folder
# # For more info, please refer to https://aka.ms/vscode-docker-dotnet-configure-containers
# RUN adduser -u 5678 --disabled-password --gecos "" appuser && chown -R appuser /app
# USER appuser

# FROM mcr.microsoft.com/dotnet/sdk:6.0-focal AS build
# WORKDIR /src
# COPY ["ServerApi/ServerApi.csproj", "ServerApi/"]
# RUN dotnet restore "ServerApi/ServerApi.csproj"
# COPY . .
# WORKDIR "/src/ServerApi"
# RUN dotnet build "ServerApi.csproj" -c Release -o /app/build

# FROM build AS publish
# RUN dotnet publish "ServerApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

# FROM base AS final
# WORKDIR /app
# COPY --from=publish /app/publish .
# ENTRYPOINT ["dotnet", "ServerApi.dll"]


# FROM mcr.microsoft.com/dotnet/core/sdk:3.1-bionic AS build
WORKDIR /app

# copy csproj and restore as distinct layers
COPY *.sln .
COPY ServerApi/*.csproj ./ServerApi/
RUN dotnet restore

# copy everything else and build app
COPY ServerApi/. ./ServerApi/
WORKDIR /app/ServerApi
RUN dotnet publish -c Release -o out

# FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-bionic AS runtime
FROM mcr.microsoft.com/dotnet/aspnet:6.0-focal AS runtime
WORKDIR /app
COPY --from=build /app/ServerApi/out .
EXPOSE 80
CMD ["dotnet", "ServerApi.dll"]
