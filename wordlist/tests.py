from django.test import TestCase
from django.test import Client
from models import Wordlist
from json import loads

class WordlistTest(TestCase):
    wordlist_count = 5
    words_count = 5
    
    def setUp(self):
        self.client = Client()
        self.maxDiff = None
    
    def test_rest(self):
        objects = []
        words = []
        def detailed(i):
            return dict(objects[i], words=words[i])
        
        # Create objects
        for i in range(0, self.wordlist_count):
            name = 'Colors'+str(i)
            resp = self.client.post('/add/',
                             {
                              'name': name,
                              's_lang': 'sl',
                              't_lang': 'tl'
                              })
            self.assertEquals(i+1, Wordlist.objects.count());
            object = loads(resp.content)
            self.assertIn('id', object)
            self.assertIn('name', object)
            self.assertEquals(object['name'], name)
            objects.append(object)
            words.append([])
            
            # Create words
            for j in range(0, self.words_count):
                word = {
                        'word': 'word'+str(j),
                        'wordlist': object['id'],
                        'translation': 'translation'+str(j)
                        }
                resp = self.client.post('/words/add/', word)
                self.assertEquals(j+1, Wordlist.objects.get(pk=object['id']).word_set.count());
                data = loads(resp.content)
                self.assertIn('id', data)
                self.assertIn('word', data)
                self.assertIn('wordlist', data)
                self.assertIn('translation', data)
                self.assertEquals(data['word'], word['word'])
                self.assertEquals(data['wordlist'], word['wordlist'])
                self.assertEquals(data['translation'], word['translation'])
                words[i].append(data)

        # List objects
        resp = self.client.get('/')
        data = loads(resp.content)
        self.assertListEqual(objects, data)
        
        # Update object
        object = objects[0]
        object['name'] = 'CHANGED'
        resp = self.client.post('/'+str(object['id'])+'/edit/',
                                {
                                 'name': object['name']
                                 })
        data = loads(resp.content)
        self.assertEquals(Wordlist.objects.get(pk=object['id']).name, object['name'])
        self.assertEquals(True, data)
        
        # Read object
        object = detailed(0)
        resp = self.client.get('/'+str(object['id'])+'/')
        data = loads(resp.content)
        self.assertDictEqual(object, data)
        
        # Delete object
        object = objects[0]
        resp = self.client.post('/'+str(object['id'])+'/delete/')
        data = loads(resp.content)
        self.assertRaises(Exception, lambda : Wordlist.objects.get(pk=object['id']))
        self.assertEquals(True, data)