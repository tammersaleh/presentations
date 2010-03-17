require 'sinatra/base'
require 'sinatra/ratpack'
require 'helpers'
require 'haml'
require 'haml_filters'

class Podium < Sinatra::Base
  helpers Sinatra::Ratpack
  helpers Podium::Helpers

  get "/" do
    haml :index
  end

  get '/courses/:course' do
    haml File.join(params[:course], "index").to_sym
  end

  get '/courses/:course/workshops' do
    haml File.join(params[:course], "workshops", "index").to_sym
  end

  get '/courses/:course/workshops/:section' do
    haml File.join(params[:course], "workshops", params[:section]).to_sym
  end

  get "/courses/:course/slides" do
    haml File.join(params[:course], "slides", "index").to_sym, :layout => :"slides"
  end
end

