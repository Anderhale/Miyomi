
import xml.etree.ElementTree as ET
import os

svg_path = r'g:\Miyomi\public\vecteezy_white-snowflakes-on-a-blue-background-for-winter-design_33488470.svg'
output_path = r'g:\Miyomi\src\components\snowflakePaths.ts'

def extract_paths():
    try:
        # Register namespaces if necessary, but ET often handles default ns clumsily
        # stripping namespaces for easier parsing
        with open(svg_path, 'r', encoding='utf-8') as f:
            xml_content = f.read()
        
        # Remove namespace prefixes for simplicity
        xml_content = xml_content.replace('xmlns="http://www.w3.org/2000/svg"', '')
        xml_content = xml_content.replace('xmlns:xlink="http://www.w3.org/1999/xlink"', '')
        
        root = ET.fromstring(xml_content)
        
        paths = set()
        
        for path in root.findall('.//path'):
            d = path.get('d')
            if d and len(d) > 200: # Filter out simple boxes/clipping rects
                paths.add(d)
        
        print(f"Found {len(paths)} distinct complex paths.")
        
        # Write to TS file
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write("export const SNOWFLAKE_PATHS = [\n")
            for i, p in enumerate(paths):
                f.write(f"    `{p}`,\n")
            f.write("];\n")
            
        print(f"Successfully wrote paths to {output_path}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    extract_paths()
