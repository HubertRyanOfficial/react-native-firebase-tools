function getRefProperties(
  ref: any,
  propertyName: string
): string | boolean | number | undefined {
  const refValues = Object.values(ref);
  const refProperties = refValues[2] as any;

  // * Getting property value in firestore modules such as limit(3) function value, startAfter and others with prefix _ (private variables)
  const propertyWithPrefix = `_${propertyName}`;

  if (refProperties && refProperties[propertyWithPrefix]) {
    return refProperties[propertyWithPrefix];
  }

  return undefined;
}

export { getRefProperties };
