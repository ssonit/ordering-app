export function NewFullCustomResponse(data: any, error: any, message?: string) {
  return {
    data,
    error,
    message
  }
}

export function NewCustomErrorResponse(error: any) {
  return NewFullCustomResponse(null, error, 'An error occurred')
}

export function NewResponseSuccess(data: any) {
  return NewFullCustomResponse(data, null)
}

export function NewResponseError(error: any) {
  return NewFullCustomResponse(null, error)
}
