import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useThemeStore } from '../../store/themeStore';

describe('themeStore', () => {
  beforeEach(() => {
    useThemeStore.setState({ theme: 'light' });
    document.documentElement.classList.remove('dark');
  });

  it('starts with light theme', () => {
    expect(useThemeStore.getState().theme).toBe('light');
  });

  it('toggleTheme switches from light to dark', () => {
    useThemeStore.getState().toggleTheme();

    expect(useThemeStore.getState().theme).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('toggleTheme switches from dark to light', () => {
    useThemeStore.setState({ theme: 'dark' });
    document.documentElement.classList.add('dark');

    useThemeStore.getState().toggleTheme();

    expect(useThemeStore.getState().theme).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('setTheme sets dark theme and adds class', () => {
    useThemeStore.getState().setTheme('dark');

    expect(useThemeStore.getState().theme).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('setTheme sets light theme and removes class', () => {
    document.documentElement.classList.add('dark');
    useThemeStore.getState().setTheme('light');

    expect(useThemeStore.getState().theme).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('initTheme applies stored dark theme', () => {
    useThemeStore.setState({ theme: 'dark' });
    useThemeStore.getState().initTheme();

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('initTheme applies light when stored as light', () => {
    useThemeStore.setState({ theme: 'light' });
    document.documentElement.classList.remove('dark');

    useThemeStore.getState().initTheme();
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});
