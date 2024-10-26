defmodule OdeWeb.TerminalLive do
  use OdeWeb, :live_view

  def mount(_params, _session, socket) do
    {:ok, assign(socket, output: [], page_title: "ODE Terminal")}
  end

  def render(assigns) do
    ~H"""
    <div id="terminal" phx-hook="Terminal" class="w-screen h-screen [&_.terminal]:!h-full"></div>
    """
  end
end
