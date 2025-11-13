import type { License } from "../types";

export async function getLicenseText(license: License) {
  try {
    const licenseData = await import(`spdx-license-list/licenses/${license}.json`);
    const text = licenseData.licenseText || (licenseData.default && licenseData.default.licenseText);
    return text ? text.trim() : '';
  } catch (error) {
    console.warn(`Could not get text for license: ${license}`);
    throw error;
  }
}
