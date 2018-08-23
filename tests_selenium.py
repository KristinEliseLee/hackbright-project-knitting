from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
import unittest
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
import time

class TestPixelStitch(unittest.TestCase):

    def setUp(self):
        self.browser = webdriver.Firefox()

    # def tearDown(self):
    #     self.browser.quit()

    # def test_basic(self):
    #     self.browser.get('http://localhost:5000')
    #     self.assertEqual(self.browser.title, 'Pixel Stitch')

    # def test_patterns(self):
    #     self.browser.get('http://localhost:5000')
    #     patterns_link = self.browser.find_elements_by_class_name("thumbnail")
    #     patterns_link[0].click()
    #     self.assertNotEqual(self.browser.title, 'Pixel Stitch')

    # def test_login(self):
    #     self.browser.get('http://localhost:5000/login')
    #     email_field = self.browser.find_element_by_id('email')
    #     password_field = self.browser.find_element_by_id('password')
    #     email_field.send_keys('potato@potato')
    #     password_field.send_keys('password')
    #     submit = self.browser.find_element_by_id('submit')
    #     submit.click()
    #     self.assertEqual(self.browser.title, 'Your Page')
    #     logout = self.browser.find_element_by_link_text('Log Out')
    #     logout.click()
    #     self.browser.get('http://localhost:5000/user')
    #     self.assertNotEqual(self.browser.title, 'Your Page')

    def test_new_pattern(self):
        self.browser.get('http://localhost:5000/login')
        email_field = self.browser.find_element_by_id('email')
        password_field = self.browser.find_element_by_id('password')
        email_field.send_keys('potato@potato')
        password_field.send_keys('password')
        submit = self.browser.find_element_by_id('submit')
        submit.click()
        new_pattern=self.browser.find_element_by_link_text('New Pattern')
        new_pattern.click()
        time.sleep(2)
        edit_buttons= self.browser.find_elements_by_class_name('edit')
        print(edit_buttons)
        for button in edit_buttons:
            button.click()
        rows = self.browser.find_elements_by_class_name('rowEdit')
        print(rows)
        for row in rows:
            row.send_keys('K10')
        saves = self.browser.find_elements_by_class_name('rowSave')
        for save in saves:
            save.click()

        name = self.browser.find_element_by_class_name('nameBox')
        name.send_keys('test')
        save = self.browser.find_element_by_class_name('savePattern')
        time.sleep(2)
        save.click()




if __name__ == '__main__':
    unittest.main()
