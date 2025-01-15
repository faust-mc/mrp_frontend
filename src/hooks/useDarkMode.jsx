import { useState, useEffect } from 'react';

const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Apply dark mode based on localStorage on component mount
  useEffect(() => {
    const storedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(storedDarkMode);
    applyDarkMode(storedDarkMode);
  }, []);

  const applyDarkMode = (apply) => {
    const container = document.querySelector('.container');
    const result = document.querySelectorAll('.result');
    const navLinks = document.querySelectorAll('.nav-link');
    const detail = document.querySelectorAll('.detail');
    const label = document.querySelectorAll('.progress-label');
    const tabContent = document.querySelectorAll('.tab-content');
    const active = document.querySelector('.active');
    const accordionButton = document.querySelectorAll('.accordion-button');
    const accordionBody = document.querySelectorAll('.accordion-body');
    const table = document.querySelector('.table');
    const card = document.querySelectorAll('.card');
    const accordionCollapse = document.querySelectorAll('.accordion-collapse');
    const accordionHeader = document.querySelectorAll('.accordion-header');
    const checkbox = document.getElementById('checkbox');

    if (apply) {
      document.body.classList.add('dark-mode');
      if (container) container.classList.add('dark-mode');
      if (active) active.classList.add('dark-mode');
      accordionBody.forEach(body => body.classList.add('dark-mode'));
      if (table) table.classList.add('table-dark');
      result.forEach(item => item.classList.add('dark-mode'));
      navLinks.forEach(link => link.classList.add('dark-mode'));
      detail.forEach(item => item.classList.add('dark-mode'));
      label.forEach(item => item.classList.add('dark-mode'));
      tabContent.forEach(content => content.classList.add('dark-mode'));
      card.forEach(c => {
        c.classList.add('bg-secondary');
        c.classList.add('text-white');
        c.classList.remove('bg-light');
        c.classList.remove('text-black');
      });
      accordionButton.forEach(button => button.classList.add('dark-mode'));
      accordionCollapse.forEach(collapse => collapse.classList.add('dark-mode'));
      accordionHeader.forEach(header => header.classList.add('dark-mode'));
      if (checkbox) checkbox.checked = true;
    } else {
      document.body.classList.remove('dark-mode');
      if (container) container.classList.remove('dark-mode');
      if (active) active.classList.remove('dark-mode');
      accordionBody.forEach(body => body.classList.remove('dark-mode'));
      if (table) table.classList.remove('table-dark');
      result.forEach(item => item.classList.remove('dark-mode'));
      navLinks.forEach(link => link.classList.remove('dark-mode'));
      detail.forEach(item => item.classList.remove('dark-mode'));
      label.forEach(item => item.classList.remove('dark-mode'));
      tabContent.forEach(content => content.classList.remove('dark-mode'));
      card.forEach(c => {
        c.classList.remove('bg-secondary');
        c.classList.remove('text-white');
        c.classList.add('bg-light');
        c.classList.add('text-black');
      });
      accordionButton.forEach(button => button.classList.remove('dark-mode'));
      accordionCollapse.forEach(collapse => collapse.classList.remove('dark-mode'));
      accordionHeader.forEach(header => header.classList.remove('dark-mode'));
      if (checkbox) checkbox.checked = false;
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    applyDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  return [isDarkMode, toggleDarkMode];
};

export default useDarkMode;
