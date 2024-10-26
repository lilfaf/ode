defmodule OdeWeb.TerminalLive do
  use OdeWeb, :live_view

  def mount(_params, _session, socket) do
    {:ok, assign(socket, output: [], page_title: "ODE Terminal")}
  end

  def render(assigns) do
    ~H"""
    <div class="w-screen h-screen bg-black p-3">
      <div id="terminal" phx-hook="Terminal" class="w-full h-full [&_.terminal]:!h-full"></div>
    </div>
    """
  end
end
