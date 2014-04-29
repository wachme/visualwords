from django.test import TestCase
from django.test import Client
from json import loads
from django.core.urlresolvers import reverse

class ImagesTest(TestCase):
    def setUp(self):
        self.client = Client()
        
    def test_images(self):
        resp = self.client.post(reverse('provider-images'), {
                                           'word': 'testing'
                                           })
        data1 = loads(resp.content)
        self.assertEquals(1, len(data1))
        
        resp = self.client.post(reverse('provider-images'), {
                                           'word': 'testing',
                                           'n': '100'
                                           })
        data100 = loads(resp.content)
        self.assertEquals(100, len(data100))
        self.assertListEqual(data100[:1], data1)
        
        resp = self.client.post(reverse('provider-images'), {
                                           'word': 'testing',
                                           'n': '101'
                                           })
        data101 = loads(resp.content)
        self.assertEquals(101, len(data101))
        self.assertListEqual(data101[:100], data100)
        
        resp = self.client.post(reverse('provider-images'), {
                                           'word': 'testing',
                                           'n': '200'
                                           })
        data200 = loads(resp.content)
        self.assertEquals(200, len(data200))
        self.assertListEqual(data200[:101], data101)
        
    def test_translations(self):
        resp = self.client.post(reverse('provider-translations'), {
                                                   'word': 'test',
                                                   's_lang': 'en',
                                                   't_lang': 'pl'
                                                   })
        data = loads(resp.content)
        self.assertEquals(2, len(data))
        self.assertEquals('badanie', data[0][1])
        
        resp = self.client.post(reverse('provider-translations'), {
                                                   'word': 'sdgdfhgfgs',
                                                   's_lang': 'en',
                                                   't_lang': 'pl'
                                                   })
        data = loads(resp.content)
        self.assertEquals(False, data)
        