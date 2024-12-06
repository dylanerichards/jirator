class Api::ConfigController < ApplicationController
  def index
    project_key = ENV['JIRA_PROJECT_KEY']
    Rails.logger.info "Config endpoint called. JIRA_PROJECT_KEY: #{project_key.inspect}"
    
    if project_key.blank?
      Rails.logger.error "JIRA_PROJECT_KEY is not set in environment variables"
    end
    
    render json: {
      jira_project_key: project_key,
      timestamp: Time.current
    }
  end
end 