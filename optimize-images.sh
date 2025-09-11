#!/bin/bash

# Script de optimización de imágenes para formato WebP/AVIF
# REQUIERE: Instalar primero las herramientas con: brew install imagemagick webp libavif

echo "🚀 Iniciando optimización de imágenes..."
echo "📋 Primero necesitas instalar las herramientas:"
echo "   brew install imagemagick webp libavif"
echo ""

# Verificar si las herramientas están instaladas
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick no está instalado. Ejecuta:"
    echo "   brew install imagemagick"
    exit 1
fi

if ! command -v cwebp &> /dev/null; then
    echo "❌ WebP tools no están instalados. Ejecuta:"
    echo "   brew install webp"
    exit 1
fi

if ! command -v avifenc &> /dev/null; then
    echo "❌ AVIF tools no están instalados. Ejecuta:"
    echo "   brew install libavif"
    exit 1
fi

echo "✅ Todas las herramientas están instaladas!"
echo ""

# Crear directorio para imágenes optimizadas
mkdir -p images/optimizadas

# Función para optimizar imagen
optimize_image() {
    local input_file="$1"
    local output_dir="$2"
    local filename=$(basename "$input_file" | sed 's/\.[^.]*$//')
    
    echo "📊 Optimizando: $filename"
    
    # Obtener tamaño original
    local original_size=$(stat -f%z "$input_file")
    
    # Convertir a WebP (calidad 80)
    local webp_output="$output_dir/${filename}.webp"
    cwebp -q 80 "$input_file" -o "$webp_output" 2>/dev/null
    
    if [ $? -eq 0 ] && [ -f "$webp_output" ]; then
        local webp_size=$(stat -f%z "$webp_output")
        local webp_saving=$((original_size - webp_size))
        local webp_percent=$((webp_saving * 100 / original_size))
        echo "   ✅ WebP: ${webp_size} bytes (${webp_percent}% más pequeño)"
    else
        echo "   ❌ Error creando WebP"
    fi
    
    # Convertir a AVIF (calidad 65 para buen balance calidad/tamaño)
    local avif_output="$output_dir/${filename}.avif"
    convert "$input_file" -quality 65 "$avif_output" 2>/dev/null
    
    if [ $? -eq 0 ] && [ -f "$avif_output" ]; then
        local avif_size=$(stat -f%z "$avif_output")
        local avif_saving=$((original_size - avif_size))
        local avif_percent=$((avif_saving * 100 / original_size))
        echo "   ✅ AVIF: ${avif_size} bytes (${avif_percent}% más pequeño)"
    else
        echo "   ❌ Error creando AVIF"
    fi
    
    echo ""
}

# Optimizar imágenes principales
echo "🎯 Imágenes principales:"
optimize_image "tu-foto-perfil.jpg" "images/optimizadas"
optimize_image "freelancer-icon.png" "images/optimizadas"

# Optimizar imágenes de proyectos
echo "🎯 Imágenes de proyectos:"
for img in images/proyectos/*.jpg; do
    if [ -f "$img" ]; then
        optimize_image "$img" "images/optimizadas"
    fi
done

echo "✅ Optimización completada!"
echo "📁 Imágenes optimizadas guardadas en: images/optimizadas/"
echo ""
echo "📋 Resumen de formatos:"
echo "   • WebP: Buen soporte, excelente compresión"
echo "   • AVIF: Mejor compresión, soporte moderno"
echo ""
echo "🚀 Para usar las imágenes optimizadas, actualiza tu HTML con:"
echo "   <picture>"
echo "     <source srcset='imagen.avif' type='image/avif'>"
echo "     <source srcset='imagen.webp' type='image/webp'>"
echo "     <img src='imagen.jpg' alt='Descripción' loading='lazy'>"
echo "   </picture>"