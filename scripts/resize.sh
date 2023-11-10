#!/bin/zsh

# Pour zsh, si un motif glob ne correspond à aucun fichier, passez simplement une chaîne vide plutôt que de générer une erreur
setopt +o nomatch

# Vérifiez si un chemin de dossier a été fourni
if [ -z "$1" ]; then
    echo "Usage: $0 <dossier>"
    exit 1
fi

# Vérifiez si le dossier existe
if [ ! -d "$1" ]; then
    echo "Le dossier $1 n'existe pas."
    exit 1
fi

# Chemin du dossier d'entrée
input_folder="$1"
output_folder="$2"

# Créer un dossier de sortie s'il n'existe pas
mkdir -p "$output_folder"

# Boucle à travers les fichiers image du dossier
for image_file in "${input_folder}"/*.{jpg,jpeg,png,gif}; do
    # Vérifier si le fichier existe réellement (nécessaire si aucun fichier n'a été trouvé avec l'expansion de glob)
    if [ -f "$image_file" ]; then
        # Extraire le nom du fichier
        filename=$(basename "$image_file")
        # Exécuter ImageMagick 'convert' pour redimensionner l'image. Vous pouvez changer les dimensions et d'autres options selon vos besoins
        convert -resize 20% "$image_file" "${output_folder}/${filename}"
        echo "Image $filename redimensionnée."
    fi
done

echo "Le redimensionnement des images est terminé."
