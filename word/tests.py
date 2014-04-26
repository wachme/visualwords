from django.test import TestCase
from django.test import Client
from json import loads

class ImagesTest(TestCase):
    def setUp(self):
        self.client = Client()
        
    def test_images(self):
        resp = self.client.post('/word/images/', {
                                           'word': 'testing'
                                           })
        data1 = loads(resp.content)
        self.assertEquals(1, len(data1))
        
        resp = self.client.post('/word/images/', {
                                           'word': 'testing',
                                           'n': '100'
                                           })
        data100 = loads(resp.content)
        self.assertEquals(100, len(data100))
        self.assertListEqual(data100[:1], data1)
        
        resp = self.client.post('/word/images/', {
                                           'word': 'testing',
                                           'n': '101'
                                           })
        data101 = loads(resp.content)
        self.assertEquals(101, len(data101))
        self.assertListEqual(data101[:100], data100)
        
        resp = self.client.post('/word/images/', {
                                           'word': 'testing',
                                           'n': '200'
                                           })
        data200 = loads(resp.content)
        self.assertEquals(200, len(data200))
        self.assertListEqual(data200[:101], data101)