import sys
import csv
import json
import time
import urllib.request
from urllib.error import HTTPError
from optparse import OptionParser
import bs4 as bs


USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.47 Safari/537.36'

def fix_url(url):
    fixed_url = url.strip()
    if not fixed_url.startswith('http://') and \
       not fixed_url.startswith('https://'):
        fixed_url = 'https://' + fixed_url

    return fixed_url.rstrip('/')

def extract_desc():
    print('asdasd')
    html = urllib.request.urlopen('https://www.cablesandsensors.com/products/masimo-compatible-spo2-adapter-cable-pc08-1005?variant=33802978120').read()
    s = bs.BeautifulSoup(html, 'lxml')

    print(s.title)

if __name__ == '__main__':
    url = 'https://www.cablesandsensors.com/'
    collections = []
    #extract_desc(url, 'test.csv', collections)
    extract_desc()