import { useContext, useMemo } from 'react';
import { UIContext } from '../context/uiContext';
import {
  CommandBarStepEnum,
  ProjectSettingSections,
  SettingSections,
} from '../types/general';
import { CommandBarContext } from '../context/commandBarContext';
import { DeviceContext } from '../context/deviceContext';
import { ProjectContext } from '../context/projectContext';
import { useSignOut } from './useSignOut';

export const useGlobalShortcuts = () => {
  const { setTheme } = useContext(UIContext.Theme);
  const { setChosenStep, setIsVisible } = useContext(
    CommandBarContext.Handlers,
  );
  const { setProjectSettingsSection, setProjectSettingsOpen } = useContext(
    UIContext.ProjectSettings,
  );
  const { setSettingsSection, setSettingsOpen } = useContext(
    UIContext.Settings,
  );
  const { setBugReportModalOpen } = useContext(UIContext.BugReport);
  const { openLink } = useContext(DeviceContext);
  const { setIsRegexSearchEnabled } = useContext(ProjectContext.RegexSearch);
  const handleSignOut = useSignOut();

  const toggleLightTheme = useMemo(() => {
    return {
      shortcut: ['option', '1'],
      action: () => setTheme('light'),
    };
  }, []);

  const toggleDarkTheme = useMemo(() => {
    return {
      shortcut: ['option', '2'],
      action: () => setTheme('dark'),
    };
  }, []);

  const toggleBlackTheme = useMemo(() => {
    return {
      shortcut: ['option', '3'],
      action: () => setTheme('black'),
    };
  }, []);

  const toggleSystemTheme = useMemo(() => {
    return {
      shortcut: ['option', '4'],
      action: () => setTheme('system'),
    };
  }, []);

  const openPrivateRepos = useMemo(() => {
    return {
      shortcut: ['cmd', 'P'],
      action: () => {
        setChosenStep({ id: CommandBarStepEnum.PRIVATE_REPOS });
        setIsVisible(true);
      },
    };
  }, []);

  const openPublicRepos = useMemo(() => {
    return {
      shortcut: ['cmd', 'shift', 'P'],
      action: () => {
        setChosenStep({ id: CommandBarStepEnum.PUBLIC_REPOS });
        setIsVisible(true);
      },
    };
  }, []);

  const openLocalRepos = useMemo(() => {
    return {
      shortcut: ['cmd', 'shift', 'O'],
      action: () => {
        setChosenStep({ id: CommandBarStepEnum.LOCAL_REPOS });
        setIsVisible(true);
      },
    };
  }, []);

  const openAddDocs = useMemo(() => {
    return {
      shortcut: ['cmd', 'D'],
      action: () => {
        setChosenStep({ id: CommandBarStepEnum.DOCS });
        setIsVisible(true);
      },
    };
  }, []);

  const openManageRepos = useMemo(() => {
    return {
      shortcut: ['option', 'R'],
      action: () => {
        setChosenStep({ id: CommandBarStepEnum.MANAGE_REPOS });
        setIsVisible(true);
      },
    };
  }, []);

  const createNewProject = useMemo(() => {
    return {
      shortcut: ['cmd', 'N'],
      action: () => {
        setChosenStep({ id: CommandBarStepEnum.CREATE_PROJECT });
        setIsVisible(true);
      },
    };
  }, []);

  const openProjectSettings = useMemo(() => {
    return {
      shortcut: ['option', 'P'],
      action: () => {
        setProjectSettingsSection(ProjectSettingSections.GENERAL);
        setProjectSettingsOpen(true);
        setIsVisible(false);
      },
    };
  }, []);

  const openSettings = useMemo(() => {
    return {
      shortcut: ['option', 'A'],
      action: () => {
        setSettingsSection(SettingSections.GENERAL);
        setSettingsOpen(true);
        setIsVisible(false);
      },
    };
  }, []);

  const openSubscriptionSettings = useMemo(() => {
    return {
      shortcut: ['option', 'S'],
      action: () => {
        setSettingsSection(SettingSections.SUBSCRIPTION);
        setSettingsOpen(true);
        setIsVisible(false);
      },
    };
  }, []);

  const openAppDocs = useMemo(() => {
    return {
      shortcut: ['option', 'D'],
      action: () => {
        openLink('https://bloop.ai/docs');
      },
    };
  }, []);

  const reportABug = useMemo(() => {
    return {
      shortcut: ['option', 'B'],
      action: () => {
        setBugReportModalOpen(true);
        setIsVisible(false);
      },
    };
  }, []);

  const signOut = useMemo(() => {
    return {
      shortcut: ['option', 'shift', 'Q'],
      action: () => {
        handleSignOut();
        setIsVisible(false);
      },
    };
  }, []);

  const toggleRegex = useMemo(() => {
    return {
      shortcut: ['cmd', '/'],
      action: () => {
        setIsRegexSearchEnabled((prev) => !prev);
        setIsVisible(false);
      },
    };
  }, []);

  return {
    toggleLightTheme,
    toggleBlackTheme,
    toggleDarkTheme,
    toggleSystemTheme,
    openPrivateRepos,
    openPublicRepos,
    openLocalRepos,
    openAddDocs,
    openManageRepos,
    createNewProject,
    openProjectSettings,
    openSettings,
    openSubscriptionSettings,
    openAppDocs,
    reportABug,
    signOut,
    toggleRegex,
  };
};
