/** @summary Header files */
import * as Security from './security';
import { IsThis } from './is-this';

describe('Security Utils', () => {
  /**
   * @summary This section of tests verifies functions exported via
   * uuid;
   * validateUUID;
   * apiToken;
   * hashPassword;
   * comparePassword;
   */

  it('Creates a valid V4 UUID', () => {
    const result = Security.uuid();

    expect(typeof result).toEqual('string');
    expect(result.length).toEqual(36);

    const r = new RegExp(
      /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
    );
    expect(r.test(result)).toBe(true);
  });

  it('Validates a V4 UUID', () => {
    let candidate = '7e39d6f7-af45-4b78-bbc8-9349abcdf781';

    let result = Security.validateUUID(candidate);
    expect(result).toBe(true);

    const arr = candidate.split('-');
    arr[1] = 'ZYXW';
    candidate = arr.join('-');

    result = Security.validateUUID(candidate);
    expect(result).toBe(false);

    expect(Security.validateUUID(Security.uuid())).toBe(true);
  });

  it('Creates a random character string for use as an API token', () => {
    // 1. Short string
    let result = Security.apiToken(8);
    expect(typeof result == 'string').toBe(true);
    expect(result.length).toEqual(16);

    // 2. No length, uses default
    result = Security.apiToken();
    expect(typeof result == 'string').toBe(true);
    expect(result.length).toEqual(96);

    // 3. Standard length, creates 96 character string which is
    // Base64 encoded with a length divisible by 4.
    result = Security.apiToken(48);
    expect(typeof result == 'string').toBe(true);
    expect(result.length).toEqual(96);

    const reg = new RegExp(/^[A-Za-z0-9+/]*={0,2}$/);
    expect(reg.test(result)).toBe(true);
    expect(IsThis(result.length / 4).aUseableInt).toBe(true);
  });

  it('Asynchronously creates a hashed password from the specified input string', async () => {
    const candidate = 'MyStrongPassword?';
    const result = await Security.hashPassword(candidate);
    expect(typeof result == 'string').toBe(true);
    expect(result.length).toEqual(60);

    const isValid = await Security.comparePassword(candidate, result);
    expect(isValid).toBe(true);
  });

  it('Verifies a previously hashed password from the specified input string', async () => {
    const candidate = 'MyStrongPassword?';
    const hashedA =
      '$2a$10$BZuE/syrBDtARj25qcrpaOUMziW6vAM56WSC3Nheh4WCIJWVmHaOW';
    const hashedB =
      '$2a$10$tlaEW/L.UDfc9QAe7AziKOR0ci11eU/LCObwGvNO4KThJNPL0M.zS';
    const hashedC =
      '$2a$10$fDpoWEiRlCnhpf7RH326EujWye.SehbnNNhvGZF88VK2RZMtiusOu';

    const hashedAResult = await Security.comparePassword(candidate, hashedA);
    expect(hashedAResult).toBe(true);

    const hashedBResult = await Security.comparePassword(candidate, hashedB);
    expect(hashedBResult).toBe(true);

    const hashedCResult = await Security.comparePassword(candidate, hashedC);
    expect(hashedCResult).toBe(true);
  });
});
