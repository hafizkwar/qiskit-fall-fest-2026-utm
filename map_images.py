import zipfile
import re
import xml.etree.ElementTree as ET

with zipfile.ZipFile('public/assets/committee/Event_&_Committee_Details_.docx', 'r') as z:
    xml = z.read('word/document.xml').decode('utf-8')
    rels = z.read('word/_rels/document.xml.rels').decode('utf-8')

rel_root = ET.fromstring(rels)
rel_map = {}
for child in rel_root:
    rel_map[child.attrib['Id']] = child.attrib['Target']

paragraphs = re.findall(r'<w:p[ >].*?</w:p>', xml)
for p in paragraphs:
    texts = re.findall(r'<w:t(?: [^>]+)?>(.*?)</w:t>', p)
    text = ''.join(texts).strip()
    
    images = re.findall(r'<a:blip r:embed="(rId\d+)"', p)
    
    if text:
        print('TEXT: ' + text)
    for i in images:
        print('IMAGE: ' + rel_map.get(i, i))
