export type TableData = {
  name: string
  coupling: {
    inherit: number
    other: number
    sum: number
  }
  func: {
    public: number
    private: number
    protected: number
    sum: number
  }
  field: {
    public: number
    private: number
    protected: number
    sum: number
  }
}
