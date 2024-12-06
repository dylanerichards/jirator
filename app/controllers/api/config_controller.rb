class Api::ConfigController < ApplicationController
  def index
    project_key = ENV['JIRA_PROJECT_KEY']
    jira_domain = ENV['JIRA_DOMAIN']
    
    Rails.logger.info "Config endpoint called. JIRA_PROJECT_KEY: #{project_key.inspect}, JIRA_DOMAIN: #{jira_domain.inspect}"
    
    if project_key.blank?
      Rails.logger.error "JIRA_PROJECT_KEY is not set in environment variables"
    end
    
    if jira_domain.blank?
      Rails.logger.error "JIRA_DOMAIN is not set in environment variables"
    end
    
    render json: {
      jira_project_key: project_key,
      jira_base_url: jira_domain,
      timestamp: Time.current
    }
  end
end 