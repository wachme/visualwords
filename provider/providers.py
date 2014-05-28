from urllib2 import build_opener, quote, unquote
from simplejson import loads, dumps
import re

def browser_opener():
    self = browser_opener
    if not hasattr(self, 'opener'):
        self.opener = build_opener()
        self.opener.addheaders = [('User-agent', 'Mozilla/5.0 (X11; Linux x86_64) '
                                  'AppleWebKit/537.36 (KHTML, like Gecko) '
                                  'Chrome/30.0.1599.114 Safari/537.36')]
    return self.opener


class GoogleImages(object):
    opener = browser_opener()
    
    def findImages(self, word, n=1):
        return self.parse_response(self.get_data(word, n), n)
        
    def get_data(self, word, n):
        return ''.join(self.opener.open(self.get_url(word, i)).read()
                       for i in xrange(0, n / 100 + 1))
            
        
    def get_url(self, word, i):
        return 'https://www.google.com/search?q=%s&tbm=isch&ijn=%d' % (quote(word), i)
    
    def parse_response(self, data, n):
        items = re.findall(r'\href\=\".+?\?imgurl\=(.*?)\&amp'
                           '.+?data\-src\=\"(.*?)\"', data)[:n]
        
        def u(s):
            return unquote(unquote(s))
        
        return [ {'origin': u(i[0]), 'preview': u(i[1])} for i in items ]
        
    
class GoogleTranslations(object):
    opener = browser_opener()
    
    def findTranslations(self, word, s_lang, t_lang):
        return self.get_translations(self.get_data(word, s_lang, t_lang))
    
    def get_translations(self, data):
        return [ t[1] for t in data[1] ] if isinstance(data[1], list) else False
    
    def get_data(self, word, s_lang, t_lang):
        data = self.opener.open(self.get_url(word, s_lang, t_lang)).read()
        for r in [r'(?<=[\[\,])\,', r'\,(?=[\]\,])']:
            data = re.sub(r, '', data)
        return loads(data)
    
    def get_url(self, word, s_lang, t_lang):
        return ('http://translate.google.com/translate_a/'
        't?client=t&sl=%s&tl=%s&ie=UTF-8&oe=UTF-8&q=%s') % (
                                                            quote(s_lang),
                                                            quote(t_lang),
                                                            quote(word.encode('utf8')))
    
    def get_languages(self):
        # TODO: load languages from the service
        return [
                { 'name': 'polish', 'value': 'pl' },
                { 'name': 'english', 'value': 'en' },
                { 'name': 'russian', 'value': 'ru' },
                { 'name': 'french', 'value': 'fr' },
                { 'name': 'german', 'value': 'de' },
            ]