export function NewFullCustomResponse(data: any, error: any, message: string) {
  return {
    data,
    error,
    message
  }
}

export function NewCustomErrorResponse(data: any, error: any) {
  return NewFullCustomResponse(data, error, 'An error occurred')
}
