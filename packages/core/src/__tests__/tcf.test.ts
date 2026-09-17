import { getTCData, isTcfAvailable, onTcfChange, ping, waitForTcfDecision } from '../tcf';

type Cb = (value: unknown, success: boolean) => void;

function installCmp(handler: (command: string, cb: Cb, parameter?: unknown) => void) {
  (window as unknown as { __tcfapi?: unknown }).__tcfapi = (
    command: string,
    _version: number,
    cb: Cb,
    parameter?: unknown
  ) => handler(command, cb, parameter);
}

afterEach(() => {
  delete (window as unknown as { __tcfapi?: unknown }).__tcfapi;
});

describe('tcf köprüsü', () => {
  it('TCF olmayan sitede null döner, patlamaz', async () => {
    expect(isTcfAvailable()).toBe(false);
    await expect(getTCData()).resolves.toBeNull();
    await expect(ping()).resolves.toBeNull();
    expect(() => onTcfChange(() => {})()).not.toThrow();
  });

  it('karar verilmemişse getTCData null döner', async () => {
    installCmp((command, cb) => {
      if (command === 'getTCData') cb(null, false);
    });
    await expect(getTCData()).resolves.toBeNull();
  });

  it('karar verilmişse TCData döner', async () => {
    installCmp((command, cb) => {
      if (command === 'getTCData') cb({ tcString: 'CQqt', eventStatus: 'useractioncomplete' }, true);
    });
    const data = await getTCData();
    expect(data?.tcString).toBe('CQqt');
  });

  it('CMP patlarsa null döner', async () => {
    installCmp(() => {
      throw new Error('cmp bozuk');
    });
    await expect(getTCData()).resolves.toBeNull();
  });

  it('dinleyici kaldırılırken removeEventListener listenerId ile çağrılır', () => {
    const removed: unknown[] = [];
    installCmp((command, cb, parameter) => {
      if (command === 'addEventListener') cb({ listenerId: 7, eventStatus: 'tcloaded' }, true);
      if (command === 'removeEventListener') removed.push(parameter);
    });
    const off = onTcfChange(() => {});
    off();
    expect(removed).toEqual([7]);
  });

  // CMP, addEventListener callback'ini SENKRON çağırabiliyor. İlk sürümde
  // `remove` const olduğu için bu yol TDZ hatası veriyordu.
  it('CMP senkron cevap verirse waitForTcfDecision kilitlenmez', async () => {
    installCmp((command, cb) => {
      if (command === 'addEventListener') {
        cb({ listenerId: 1, eventStatus: 'useractioncomplete', tcString: 'CQqtX' }, true);
      }
    });
    await expect(waitForTcfDecision(50)).resolves.toMatchObject({ tcString: 'CQqtX' });
  });

  it('karar gelmezse zaman aşımında null döner', async () => {
    jest.useFakeTimers();
    installCmp((command, cb) => {
      if (command === 'addEventListener') cb({ listenerId: 1, eventStatus: 'cmpuishown' }, true);
    });
    const pending = waitForTcfDecision(1000);
    jest.advanceTimersByTime(1001);
    await expect(pending).resolves.toBeNull();
    jest.useRealTimers();
  });
});
