import urllib2
import re

def browser_opener():
    self = browser_opener
    if not hasattr(self, 'opener'):
        self.opener = urllib2.build_opener()
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
        return 'https://www.google.pl/search?q=%s&tbm=isch&ijn=%d' % (word, i)
    
    def parse_response(self, data, n):
        items = re.findall(r'\<a class\=\"rg_l\" href\=\".+?imgurl\=(.*?)\&amp'
                           '.+?data\-src\=\"(.*?)\"', data)[:n]
        
        def u(s):
            return urllib2.unquote(urllib2.unquote(s))
        
        return [ {'origin': u(i[0]), 'preview': u(i[1])} for i in items ]
        
    
class GoogleTranslations(object):
    opener = browser_opener()
    
    def findTranslations(self, word):
        return []
