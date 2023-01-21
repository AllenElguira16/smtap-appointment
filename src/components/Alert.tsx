import { useDomReady } from '@/hooks';
import { useEffect } from 'react';
import { Portal } from 'react-portal';
import { useRecoilState } from 'recoil';
import { alertState } from '../state';

export function Alert() {
  const isDomReady = useDomReady();

  const [alert, setAlert] = useRecoilState(alertState);

  const alertStatusMap: Record<string, { text: string; icon: string }> = {
    info: {
      text: 'alert-info',
      icon: 'info',
    },
    success: {
      text: 'alert-success',
      icon: 'check_circle_outline',
    },
    warning: {
      text: 'alert-warning',
      icon: 'warning_amber',
    },
    error: {
      text: 'alert-error',
      icon: 'highlight_off',
    },
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (alert.isOpen)
      timeout = setTimeout(() => {
        setAlert({
          isOpen: false,
          message: '',
          type: '',
        });
      }, 3000);

    return () => clearTimeout(timeout);
  }, [alert.isOpen, setAlert]);

  if (!isDomReady) return null;
  return (
    <Portal node={document.body}>
      {alert.isOpen && (
        <div
          className={`alert ${
            alertStatusMap[alert.type].text
          } shadow-lg absolute bottom-2 right-2 w-1/6`}
        >
          <div>
            <i className="material-icons">{alertStatusMap[alert.type].icon}</i>
            {alert.message}
          </div>
        </div>
      )}
    </Portal>
  );
}
